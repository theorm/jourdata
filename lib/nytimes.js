var request = require('request')
  , _ = require('lodash');

/*
  A client of New York Times API: http://developer.nytimes.com/docs
  Options:
    * `articleApiKey` *required*
    * `debug` print debug info
*/
var NYTimes = function(options) {
  this.options = options || {};
  this.articleSearchUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';

  if (!this.options.articleApiKey) throw new Error("articelApiKey option is required");
}

/*
  Params:
    * `query` is an object containing parameters from here:
    [http://developer.nytimes.com/docs/read/article_search_api_v2#h2-requests]

  There is one exception in parameters - `page`. The search method will iterate
  through the pages and return combined result.
*/
NYTimes.prototype.searchArticle = function(query, callback) {
  var page = 0;
  var results = [];

  var params = _.clone(query);
  params['api-key'] = this.options.articleApiKey;
  var options = {
    uri: this.articleSearchUrl,
    qs: params,
  }

  var debug = this.options.debug;

  function runRequest() {

    params.page = page;
    request(options, function(err, response, body) {
      var docs = [];

      try {
        var jsonBody = JSON.parse(body);
        if (jsonBody && jsonBody.response && jsonBody.response.docs) {
          docs = jsonBody.response.docs;
        }
      } catch(e) {
      }

      if (debug) {
        console.log('Got %s new documents from page %s', docs.length, options.qs.page);
      }
      results = results.concat(docs);

      if (err || response.statusCode != 200) {
        return callback(err || response.statusCode, results);
      } else {
        if (docs.length == 0) {
          return callback(null, results);
        } else {
          page++;
          runRequest();
        }
      }
    });
  }

  runRequest();
}

module.exports.NYTimes = NYTimes;
