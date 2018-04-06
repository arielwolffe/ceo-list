const request = require("request");
const cheerio = require("cheerio");
const URL = require("url-parse");

//Search Criteria to determine if page is appropriate
let keywords = ["CEO", "Founder", "Owner", "Co-founder"];
let prefix = ["she", "her", "female"];

//Hardset page limit to reduce loading time
var MAX_PAGES_TO_VISIT = 1000;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
// var baseUrl = url.protocol + "//" + url.hostname;

visitSearchPage();

function wikiCrawler() {
  if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    //visitPage(nextPage, crawl);
  }
}

function visitSearchPage() {
  //Run initial general wiki search with parameters for wikipedia
  var search_url =
    "https://en.wikipedia.org/w/index.php?search=female+ceo&limit=500";
  console.log("Visiting page " + search_url);
  request(search_url, function(error, response, body) {
    if (error) {
      console.log("Error: " + error);
    }
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if (response.statusCode === 200) {
      // Parse the document body
      var $ = cheerio.load(body);
      //   var isCEOMatch = searchIfCEO($, keywords, prefix);
      //   if (isCEOMatch) {
      $("li .mw-search-result-heading").each(function(index) {
        //grab each search result link and place in PagestoVisit array
        var link = $(this)
          .find("li .mw-search-result-heading > a")
          .attr("href");

        pagesToVisit.push(link);
      });
      //log the results
      console.log(pagesToVisit);
      wikiCrawler();
    } else {
      // collectInternalLinks($);
      // // In this short program, our callback is just calling crawl()
      // callback();
    }
    // }
  });
}

function searchIfCEO($, words, female) {
  var bodyText = $("html > body").text();
  female.forEach(element => {
    if (bodyText.toLowerCase().indexOf(element.toLowerCase()) !== -1) {
      words.forEach(element => {
        if (bodyText.toLowerCase().indexOf(element.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
    }
    return false;
  });

  return false;
}

// function collectInternalLinks($) {
//   var relativeLinks = $("a[href^='/']");
//   console.log("Found " + relativeLinks.length + " relative links on page");
//   relativeLinks.each(function() {
//     pagesToVisit.push(baseUrl + $(this).attr("href"));
//   });
// }
