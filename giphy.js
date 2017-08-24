'use strict';
var $ = require('jquery');
console.log($);

var api_key = require('./config/giphy_api.js'),
  url = 'http://api.giphy.com/v1/gifs/search?q=fail&api_key='+api_key+'&limit=1';
