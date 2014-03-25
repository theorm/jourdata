var request = require('request')
  , _ = require('lodash');


var Blockchain = function(options) {
  this.options = options || {};
  this.url = 'https://blockchain.info';
}

Blockchain.prototype.getXBTUSDRateDaily = function(callback) {
  var url = '/charts/market-price?timespan=all&format=json';
  var options = {
    uri: this.url + '/charts/market-price',
    qs: {
      timespan: 'all',
      format: 'json'
    }
  };

  request(options, function(err, response, body) {
    var result = [];
    try {
      var jsonBody = JSON.parse(body);
      if (jsonBody.values) result = jsonBody.values;
    } catch(e) {
    }

    if (err || response.statusCode != 200 || !jsonBody || !jsonBody.values) {
      return callback(err || response.statusCode || 'No body', result);
    } else {
      return callback(null, result);
    }

  });
}

module.exports.Blockchain = Blockchain;