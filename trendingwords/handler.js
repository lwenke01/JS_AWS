'use strict';

const request = require('axios');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { differenceWith, isEqual } = require('lodash');
const { extractListingsFromHTML } = require('./helpers');
const { mailBox } = require('./config');

let url = 'http://www.urbandictionary.com/';

module.exports.gettrendwords = (event, context, callback) => {
  let newWords, allWords;

  request(url)
  .then(({data}) => {

    allWords = extractListingsFromHTML(data);


    //get new
    return dynamo.scan({
      TableName: 'trendwords'
    }).promise();

  })
  .then(response => {
    let todayWords = response.Items[0] ? response.Items[0].words : [];

    newWords = differenceWith(allWords, todayWords, isEqual);

    const wordsToDelete = response.Items[0] ? response.Items[0].wordId : null;

    if(wordsToDelete){
      return dynamo.delete({
        TableName: 'trendwords',
        Key: {
          wordId : wordsToDelete
        }
      }).promise();

    }else return;

  })
  .then(()=>{
    return dynamo.put({
      TableName: 'trendwords',
      Item: {
        wordId: new Date().toString(),
        words: allWords
      }
    }).promise();
  })
  .then(()=>{
    if (newWords.length) {
      let transporter = nodemailer.createTransport(mailBox);

      var mailOptions = {
                  from: '"Trending Slang" <trendingslang@gmail.com>', // sender address
                  to: 'lwenke@gmail.com',
                  subject: 'Daily Slang: "' + newWords[0].title+'"', // Subject line
                  html:
                  '<a href='+url+newWords[0].link +'><h3> "'+ newWords[0].title +'"</h3></a>'
                  +'<br>'
                  +'<p><strong>'+newWords[0].meaning +' </strong> </p>'
                  +'<br>'
                  +'<p><em>Example: </em> '+newWords[0].example +'</p>'
                  +'<br>'
                  +'<a href='+url+newWords[0].link +'><h5>Link here</h5></a>'
              };

              transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                      return console.log(error);
                  } else {
                      console.log('emails sent: ', info.response);


                  }

              });


     }
    callback(null, {words: newWords})
  })
  .catch(callback);

};
