
# New York Times Crossword Chrome Extension

## Auth0 Login

Users will login with Auth0 and enter their name, then they'll run the extension on the leaderboard and if the name they entered matches the one with "(you)" written on it then we consider that verified.

## Process

1. Icon has a link to the leaderboard: https://www.nytimes.com/puzzles/leaderboards
2. Every time we load the leaderboard page, we run:
  - For each `lbd-score` with rank, record the `lbd-score__name` and `lbd-score__time` for the day, (no need to record rank, we can remake that within groups)
  - Update the db if necessary

## Database

### Users

- Auth0 ID
- Username
- Verified

### Times

- Username
- Date
- Time

### GroupUsers

- GroupID
- Username

### Groups

- GroupID
- Name