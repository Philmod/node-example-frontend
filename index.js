var path = require('path');
var express = require('express');
var app = express();
var os = require('os');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var serverStatus = require('express-server-status');

app.use(morgan('dev'));
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/public'));
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index.hbs', {
    websocketHost: process.env.WEBSOCKET_HOST || 'ws://localhost:3002',
    websocketPath: process.env.WEBSOCKET_PATH || '/socket.io',
    htmlserver: os.hostname()
  });
});

app.use('/status', serverStatus(app));

// The next routes are used to test kubernetes.
app.get('/break', function(req, res) {
  while (true) {}
});
app.get('/slow', function(req, res) {
  var delay = req.query.delay || 1000;
  setTimeout(function() {
    return res.sendStatus(200);
  }, delay);
});

/**
 * Start server if not test environment.
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, function() {
    console.log('listening on *:3001');
  });
}

module.exports = app;
