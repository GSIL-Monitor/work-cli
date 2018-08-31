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
mkdir -p $OUTPUT_PATH/motor/sf/car_hero

cp settings.py $OUTPUT_PATH/settings.py
cp -rf dist/*.html $OUTPUT_PATH/motor/sf/car_hero/
cp dist/sw.js $OUTPUT_PATH/motor/sf/car_hero/sw.js
cp src/test.html $OUTPUT_PATH/motor/sf/car_hero/test.html
cp MP_verify_gwMI7HyMIFWO3jV7.txt $OUTPUT_PATH/motor/sf/car_hero/MP_verify_gwMI7HyMIFWO3jV7.txt
find dist -name '*.html' -exec rm {} \;

