'use strict';
const request = require('axios');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { differenceWith, isEqual } = require('lodash');
const { extractListingsFromHTML } = require('./helpers');
const { mailBox, sender } = require('./config');
const { emailList } = require('./emails');

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
    console.log(sender);

    if (newWords.length) {
      let transporter = nodemailer.createTransport(mailBox);

      emailList.forEach((email)=>{

        let mailOptions = {
                  from: sender, // sender address
                  to: email,
                  subject: 'Slang Of The Day: "' + newWords[0].title+'"', // Subject line
                  html:
                  '<h1 style="color:magenta;"> '+ newWords[0].title +'</h1>'
                  +'<p><strong>'+newWords[0].meaning +' </strong> </p>'
                  +'<p"><em>  '+newWords[0].example +'</em></p>'
                  +'<br>'

              };

              transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                      return console.log(error);
                  } else {
                      console.log('emails sent: ', info.response);
                    }

              });
            })


     }
    callback(null, {words: newWords})
  })
  .catch(callback);

};
