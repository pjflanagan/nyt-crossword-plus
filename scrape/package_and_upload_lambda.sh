#!/bin/bash

echo "Packaging Lambda and requirements"
pip install --target ./package -r requirements.txt
cd package
zip -r ../nyt-lambda.zip .
cd ..
zip -g nyt-lambda.zip main.py
echo "Packaged lambda in nyt-lambda.zip"
echo "Cleaning up"
rm -r package
echo "Deploying to AWS"
aws lambda update-function-code --function-name nyt-crossword-plus --zip-file fileb://nyt-lambda.zip
echo "Deployed to AWS.  TODO: Keep versions in s3"