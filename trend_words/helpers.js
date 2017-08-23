'use strict';

const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');


function extractListingsFromHTML (html) {
  const $ = cheerio.load(html);
  const wordSection = $('.def-panel');
  const data_id = $('.def-panel[data-defid]');

  const newWords =[];


//for each section, scrape new word
  wordSection.each((i, ele)=>{
    let wordId = $(ele).find('.def-header > .word').attr('name');
    let title = $(ele).find('.def-header > .word').first().text().trim();
    let meaning = $(ele).children('.meaning').first().text().trim();


    newWords.push({wordId, title, meaning});

  });
     fs.appendFileSync('words.json', JSON.stringify(newWords) + '\n');
  return newWords;
}
module.exports = {
  extractListingsFromHTML
};
