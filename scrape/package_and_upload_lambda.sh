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
echo "TODO: Upload versions to s3 and automatically deploy"