'use strict';

var ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder();
module.exports = api;

// api.get('/hello', function(){
//   return 'hello world';
// });

api.get('/greet', function (request) {
  var superb = require('superb');
  console.log(request);
  return request.queryString.name + ' is ' + superb();
});
