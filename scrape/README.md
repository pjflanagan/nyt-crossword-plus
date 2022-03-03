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

## Deployment in AWS

1. Find and export your security credentials into your terminal.  You can find your security credentials from the homepage of the aws console 
, clicking your name on the top right and selecting "Security Credentials" in the dropdown.
   From here go to "Access Keys" and create a new access key.  Replace the fake access
   keys in the below command with yours
```aidl
$ export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
$ export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
$ export AWS_DEFAULT_REGION=us-west-2
```

2. Deploy the lambda function by running from nyt-crossword-plus/scrape
```aidl
$ sh package_and_upload_lambda.sh
```

3. That's it!  Now you can go the lambda console and run the function.
