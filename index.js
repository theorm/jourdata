var nytimes = require('./lib/nytimes')
  , guardian = require('./lib/guardian')
  , blockchain = require('./lib/blockchain');

module.exports.NYTimes = nytimes.NYTimes;
module.exports.Guardian = guardian.Guardian;
module.exports.Blockchain = blockchain.Blockchain;