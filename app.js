'use strict';

var ApiBuilder = require('claudia-api-builder'),
  AWS = require('aws-sdk'),
  api = new ApiBuilder(),
  dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports = api;



api.get('/fail', function(request){
  return 'Lisa rocks';
});

api.post('/fail', function(request){
  return 'Lisa rocks';
});
// api.get('/fail', function (request) {
//
//   var superb = require('superb');
//   console.log(request);
//   return request.queryString.name + ' is ' + superb();
// });
