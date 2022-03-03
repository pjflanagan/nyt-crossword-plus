import requests
import logging
from bs4 import BeautifulSoup as soup
import os
import calendar
import bitdotio
import json
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

def getUsernamesWhoHavePlayedOnDate(cur, date):
    cur.execute('SELECT username FROM "pjflanagan/nyt_crossword_plus"."times" WHERE "date"=DATE(\'{date}\');'.format(date=date))

def writeTimes(cur, entries):
    valuesFormatted = ",".join(list(map(lambda e: '(\'{username}\', \'{date}\', {time})'.format(username=e['username'], date=e['date'], time=e['time']), entries)))
    cur.execute('INSERT INTO "pjflanagan/nyt_crossword_plus"."times" ("username", "date", "time") VALUES {values};'.format(values=valuesFormatted))

def get_cookie(username, password):
    """Fetches a login cookie from the NYT api
    Args:
        username (string): Username (should be an email address).
        password (string): Password to use.

    Returns: String containing the login cookie fetched using the provided credentials.
    Raises: ValueError if cookie is not returned
    """

    print('Getting cookie')
    login_resp = requests.post(
        'https://myaccount.nytimes.com/svc/ios/v2/login',
        data={
            'login': username,
            'password': password,
        },
        headers={
            'User-Agent': 'Crosswords/20191213190708 CFNetwork/1128.0.1 Darwin/19.6.0',
            'client_id': 'ios.crosswords',
        }
    )
    login_resp.raise_for_status()
    for cookie in login_resp.json()['data']['cookies']:
        if cookie['name'] == 'NYT-S':
            return cookie['cipheredValue']
    raise ValueError('NYT-S cookie not found')

def scrape_leaderboard(cookie):
    """Scrapes the leaderboard for the user that the provided cookie corresponds to.
    Args:
        cookie (string): Login cookie for the user

    Returns: List all completed entries for the current day.
    """

    logging.info('Loading leaderboard')
    url = 'https://www.nytimes.com/puzzles/leaderboards'
    response = requests.get(url, cookies={
        'NYT-S': cookie,
    })
    page = soup(response.content, features='html.parser')
    
    solvers = page.find_all('div', class_='lbd-score')
    [_, month, day, year] = page.find('h3', class_='lbd-type__date').text.strip().split()

    day = day.replace(",", "")
    month_number = list(calendar.month_name).index(month)
    month_string = f'{month_number:02d}'
    day_string = f'{int(day):02d}'
    timestamp = year + '-' + month_string + '-' + day_string
    print('Parsed timestamp')

    entries = []
    for solver in solvers:
        name = solver.find('p', class_='lbd-score__name').text.strip()
        try:
            parsed_time = solver.find('p', class_='lbd-score__time').text.strip()

            if parsed_time != '--':
                minutes, seconds = parsed_time.split(':')
                time = (60 * int(minutes)) + int(seconds)

                if name.endswith('(you)'):
                    name = name.replace('(you)', '').strip()

                entries.append({
                    'username': name, 
                    'date': timestamp,
                    'time': time,
                })
        except:
            pass

    print('Parsed entries')
    print(entries)
    return entries

def save_entries_via_api(entries):
    """Posts the entries for the current day to the backend.
    Args:
        entries (list(dict)): Entries to send to the backend
    """

    wake_url = ('https://nytcrosswordplus.flanny.app/api/times/read/entryCount?date={date}').format(date=entries[0]['date'])
    requests.get(wake_url)

    url = ('https://nytcrosswordplus.flanny.app/api/times/write?k={api_key}').format(api_key=os.environ['API_KEY'])
    request_body = {
        'entries': entries,
    }
    serialized_body = json.dumps(request_body)
    logging.info('Serialized payload: {payload}'.format(payload=request_body))

    save_entries_response = requests.post(url, data=serialized_body)
    
    if save_entries_response.ok:
        logging.info('Received successful response: {response}'.format(response=save_entries_response.json()))
    else:
        logging.error('Received error response: {response}'.format(response=save_entries_response.json()))
    
    return save_entries_response.ok

def write_entries_to_dynamo(entries):
    """
    Writes directly to Amazon DynamoDB database
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('nyt_crossword_plus')
    print("Table status is: ")
    print(table.table_status)
    # TODO: Batch uploads batch.put_item if too slow
    for entry in entries:
        try:
            print("Loading entry " + str(entry))
            response = table.put_item(
                Item={
                    'username': entry["username"],
                    'date': entry["date"],
                    'time': entry["time"]
                }
            )
        except Exception as e:
            print(e)
    print("All items uploaded")

def get_entries_from_dynamo(date):
    """
    Gets all entries from a specific date
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('nyt_crossword_plus')
    try:
        response = table.query (
            KeyConditionExpression=Key('date').eq(date)
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return response['Items']

def save_entries_via_db(entries):
    """Inserts the entries for the current day to the db.
    Args:
        entries (list(dict)): Entries to insert into db
    """
    
    serialized_entries = json.dumps(entries)
    logging.info('Entries: {entries}'.format(entries=serialized_entries))

    logging.info('Logging into db')
    bitio_api_key = os.environ['BITIO_API_KEY']
    db = bitdotio.bitdotio(bitio_api_key)

    print("Got the API KEY")
    with db.get_connection() as con:
        cur = con.cursor()

        logging.info('Loading previous entries')
        prevUsernames = []
        try:
            prevUsernames = getUsernamesWhoHavePlayedOnDate(cur, entries[0]['date'])
        except Exception as error:
            logging.error('{error}'.format(error=error))
            return

        newEntries = []
        if prevUsernames.length > 0:
            logging.info('Filtering previous entries')
            newEntries = filter(lambda e: e in prevUsernames, entries)
        else:
            logging.info('No previous entries to filter')
        
        if len(newEntries) == 0:
            logging.info('No new entries')
            return

        logging.info('Writing new times')
        try:
            writeTimes(cur, newEntries)
            
        except Exception as error:
            logging.error('{error}'.format(error=error))
            return 

def main(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
        event (dict): Event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """

    try:
        username = os.environ['username']
        password = os.environ['password']
        cookie = os.environ['cookie']

#         entries = scrape_leaderboard(cookie)
#         write_entries_to_dynamo(entries)
        print("Getting all entries from today:")
        print("UPDATE WORKED")
#         print(get_entries_from_dynamo("2022-03-02"))

#         if (entries):
#             save_entries_via_db(entries)

    except Exception as error:
        logging.error('{error}'.format(error=error))
