
# New York Times Crossword Chrome Extension

## Auth0 Login?

## Process

1. Opens leaderboard: https://www.nytimes.com/puzzles/leaderboards
2. For each lbd-score with a lbd-score__rank, record the lbd-score__name and lbd-score__time for the day
3. Every time someone runs the extension, update the db

## Database

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