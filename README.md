
# NYT Crossword Plus

This app is a stat sheet for the NYT Daily Mini Crossword leaderboard. It is made up of several parts outlined below.

## Web Host

This is a simple webserver that features:
- A leaderboard page with history and stats 
- Next.js API endpoints that read and write to the Bit.io db
- An admin page for manual leaderboard entry

## Scraper

This is a leaderboard scraper that runs on Google Cloud once a day a few minutes before the new crossword is released using Python and BeautifulSoup.

## AutoCode

This is a Discord bot that messages a group chat with daily results.

## Chrome Extension

This is a simple Chrome extension that runs every time a user loads the leaderboard and stores any new results found. Because the scraper is being run daily, the Chrome extension is no longer the primary means of updating the db and serves only as a redundancy.