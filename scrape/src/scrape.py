import requests
from bs4 import BeautifulSoup as soup
from datetime import datetime
import csv

import env


# Login
def login(username, password):
    login_resp = requests.post(
        'https://myaccount.nytimes.com/svc/ios/v2/login',
        data={
            'login': username,
            'password': password,
        },
        headers={
            'User-Agent': 'Mozilla/5.0',
            'client_id': 'ios.crosswords',
        }
    )
    login_resp.raise_for_status()
    for cookie in login_resp.json()['data']['cookies']:
        if cookie['name'] == 'NYT-S':
            return cookie['cipheredValue']
    raise ValueError('NYT-S cookie not found')


# Scrape Leaderboard
def scrape_leaderboard(cookie):
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
    # print('Mini Times for ' + timestamp)

    entries = []
    for solver in solvers:
        name = solver.find('p', class_='lbd-score__name').text.strip()
        try:
            time = solver.find('p', class_='lbd-score__time').text.strip()
        except:
            pass
        if name.endswith('(you)'):
            name_split = name.split()
            name = name_split[0]
        entries.append([timestamp, name, time])
    return entries


# Save Entries
def save_entries(entries):
    # TODO: instead here call the backend with entries
    with open('mini_data.csv', 'w') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerows(entries)


# Main
if __name__ == '__main__':
    cookie = login(env.USERNAME, env.PASSWORD)
    entries = scrape_leaderboard(cookie)
    save_entries(entries)
