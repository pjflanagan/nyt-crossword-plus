import requests
import logging
from bs4 import BeautifulSoup as soup
from datetime import datetime
import os
import json

def get_cookie(username, password):
    """Fetches a login cookie from the NYT api
    Args:
        username (string): Username (should be an email address).
        password (string): Password to use.

    Returns: String containing the login cookie fetched using the provided credentials.
    Raises: ValueError if cookie is not returned
    """

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

    url = 'https://www.nytimes.com/puzzles/leaderboards'
    response = requests.get(url, cookies={
        'NYT-S': cookie,
    })
    page = soup(response.content, features='html.parser')
    solvers = page.find_all('div', class_='lbd-score')

    current_datetime = datetime.now()
    month = str(current_datetime.strftime('%m'))
    day = str(current_datetime.strftime('%d'))
    year = str(current_datetime.strftime('%Y'))
    timestamp = year + '-' + month + '-' + day

    entries = []
    for solver in solvers:
        name = solver.find('p', class_='lbd-score__name').text.strip()
        try:
            parsed_time = solver.find('p', class_='lbd-score__time').text.strip()

            if parsed_time != '--':
                minutes, seconds = parsed_time.split(':')
                time = (60 * int(minutes)) + int(seconds)

                if name.endswith('(you)'):
                    name.replace('(you)', '').strip()

                entries.append({
                    'username': name, 
                    'date': timestamp,
                    'time': time,
                })
        except:
            pass

    return entries

def save_entries(entries):
    """Posts the entries for the current day to the backend.
    Args:
        entries (list(dict)): Entries to send to the backend
    """

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

def main(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
        event (dict): Event payload.
        context (google.cloud.functions.Context): Metadata for the event.
    """

    try:
        cookie = event.get('attributes', {}).get('cookie')
        username = event.get('attributes', {}).get('username')
        password = event.get('attributes', {}).get('password')

        if not cookie:
            cookie = get_cookie(username, password)

        entries = scrape_leaderboard(cookie)

        if (entries):
            save_entries(entries)

    except Exception as error:
        logging.error('{error}'.format(error=error))
