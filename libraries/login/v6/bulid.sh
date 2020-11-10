#!/bin/bash -e
set -e # 确保脚本在出错时退出

uglifyjs main.js -o main.min.js -m --source-map "url=main.min.js.map"
cd template
uglifyjs phone-functions.js -o phone-functions.min.js -m --source-map "url=phone-functions.min.js.map"
uglifyjs page-functions.js -o page-functions.min.js -m --source-map "url=page-functions.min.js.map"