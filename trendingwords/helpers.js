'use strict';

const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs');


function extractListingsFromHTML (html) {
  const $ = cheerio.load(html);
  const wordSection = $('.def-panel');
  const data_id = $('.def-panel[data-defid]');

  const newTrends =[];


//for each section, scrape new word
  wordSection.each((i, ele)=>{
    let tId = $(ele).find('.def-header > .word').attr('name'),
      trend_date = $(ele).find('.row > .small-6 > .ribbon').first().text().trim(),
      title = $(ele).find('.def-header > .word').first().text().trim(),
      link = $(ele).find('.def-header > .word').attr('href'),
      meaning = $(ele).children('.meaning').first().text().trim(),
      example = $(ele).children('.example').first().text().trim();

    newTrends.push({tId, trend_date, title, link,meaning, example});

  });
     fs.appendFileSync('words.json', JSON.stringify(newTrends) + '\n');
  return newTrends;
}



module.exports = {
  extractListingsFromHTML
};
