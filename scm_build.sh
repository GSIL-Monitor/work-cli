#!/bin/sh

. /home/tiger/.nvm/nvm.sh
nvm install v8.9.2
nvm list
nvm use v8.9.2

PROJECT_PATH=`pwd`
OUTPUT_PATH="$PROJECT_PATH/output"

node -v
npm -v

npm cache clear --force
rm -rf node_modules/
npm install --registry https://registry.npm.taobao.org

rm -rf dist/
npm run build

rm -rf $OUTPUT_PATH
mkdir -p $OUTPUT_PATH/{{psm}}

cp settings.py $OUTPUT_PATH/settings.py
cp -rf dist/*.html $OUTPUT_PATH/{{psm}}/
cp dist/sw.js $OUTPUT_PATH/{{psm}}/sw.js
find dist -name '*.html' -exec rm {} \;

