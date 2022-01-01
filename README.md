
# NYT Crossword

This is a two part project.

## Web

This is a simple leaderboard webpage that displays a leaderboard for the crossword. There is also a collection of Netlify functions that read and write to the Fauna db.

## Chrome

This is a simple chrome extension that runs every time a user loads the leaderboard and stores any new results found. For security, this is an unlisted Chrome extension.

- Load all usernames and times for date
- If the username is not in there, add it

### Times
```json
{
  "date": "2021-12-24",
  "username": "username_string",
  "time": 42
}
```
