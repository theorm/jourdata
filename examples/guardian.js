var Guardian = require('..').Guardian;

var guardian = new Guardian({
  apiKey: process.env.GUARDIAN_API_KEY,
  debug: true
});

guardian.searchContent({
  q: 'bitcoin',
}, function(err, results) {
  if (err) {
    console.log('Error: ' + err);
    console.log('However got %s results', results.length);
  } else {
    console.log('Got %s documents', results.length);
  }
});
