#!/bin/bash

rm dist/knnjs*
browserify src/js/main.js --s knnjs -o dist/knnjs.js
browserify src/js/main.js --s knnjs | uglifyjs -c > dist/knnjs.min.js
uglifycss src/css/main.css > dist/knnjs.min.css

