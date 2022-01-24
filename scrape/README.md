# Scraper

## Cloud Functions Deployment
The scraper can be deployed by running the following command in this directory:
```gcloud functions deploy scrapeCrosswordLeaderboard --entry-point main --runtime python37 --trigger-resource scrape-scheduler --trigger-event google.pubsub.topic.publish --timeout 540s --set-env-vars API_KEY={API_KEY}```

## Cloud Scheduler setup
There are two Cloud Scheduler jobs that call the scrape function at the following times:
- weekdays at 6:55pm PT: cron('55 18 * * 1-5')
- weekends at 2:55pm PT: cron('55 14 * * 6,0')

These were created using:
```gcloud scheduler jobs create pubsub {JOB_NAME} --schedule {SCHEDULE} --topic scrape-scheduler --message-body {MESSAGE_BODY}```