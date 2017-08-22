'use strict';

var ApiBuilder = require('claudia-api-builder'),
  AWS = require('aws-sdk'),
  api = new ApiBuilder(),
  dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports = api;



// api.get('/hello', function(request){
//   return request;
// });

api.get('/greet', function (request) {
  var superb = require('superb');
  console.log(request);
  return request.queryString.name + ' is ' + superb();
});
