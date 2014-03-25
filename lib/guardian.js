var request = require('request')
  , _ = require('lodash');

/*
  A client of Guardian API: http://www.theguardian.com/open-platform
  Options:
    * `apiKey` *required*
    * `debug` print debug info
*/
var Guardian = function(options) {
  this.options = options || {};
  this.url = 'http://content.guardianapis.com';

  if (!this.options.apiKey) throw new Error("apiKey option is required");
}

/*
  Search guardian content. `query` params are the same as
  in 'content search':

  http://explorer.content.guardianapis.com/#/

*/
Guardian.prototype.searchContent = function(query, callback) {
  var page = 1;
  var results = [];

  var params = _.clone(query);
  params['api-key'] = this.options.apiKey;
  params['format'] = 'json';
  if (!params['page-size']) params['page-size'] = 50;

  var options = {
    uri: this.url + '/search',
    qs: params,
  }

  var debug = this.options.debug;
  var maxPages = 1;

  function runRequest() {
    params.page = page;

    if (page > maxPages) {
      return callback(null, results);
    }

    request(options, function(err, response, body) {
      var docs = [];

      var jsonBody;
      try {
        jsonBody = JSON.parse(body);
        if (jsonBody && jsonBody.response) {
          maxPages = jsonBody.response.pages;

          if (jsonBody.response.results)
            docs = jsonBody.response.results;
        }
      } catch(e) {
      }

      if (debug) {
        console.log('Got %s new documents from page %s', docs.length, options.qs.page);
      }
      results = results.concat(docs);

      if (err || response.statusCode != 200 || (jsonBody && jsonBody.response.status != 'ok')) {
        if (debug) console.log('Error: %s, %s', err, body);
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

module.exports.Guardian = Guardian;
