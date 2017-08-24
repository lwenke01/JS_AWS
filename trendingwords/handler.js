'use strict';

const request = require('axios');
const {extractListingsFromHTML} = require('./helpers');

module.exports.gettrendwords = (event, context, callback) => {
  request('http://www.urbandictionary.com')
  .then(({data}) => {
  
    const words = extractListingsFromHTML(data);
    callback(null, {words})
  })
  .catch(callback);
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  // };

  // callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
