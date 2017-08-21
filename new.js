'use strict';

var ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder(),


module.exports = api;



api.get('/hello', function(){
  return 'here';
});
