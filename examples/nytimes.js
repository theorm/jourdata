var NYTimes = require('..').NYTimes;

var nytimes = new NYTimes({
  articleApiKey: process.env.NYTIMES_ARTICLE_API_KEY,
  debug: true
});

nytimes.searchArticle({
  q: 'bitcoin',
  sort: 'newest'
}, function(err, results) {
  if (err) {
    console.log('Error: ' + err);
    console.log('However got %s results', results.length);
  } else {
    console.log('Got %s documents', results.length);
  }
});
