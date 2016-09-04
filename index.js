var app = require('express')();
var os = require('os');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var serverStatus = require('express-server-status');

// temp //
console.log('Env varibles: ', process.env);
//////////

app.use(morgan('dev'));
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render(__dirname + '/index.hbs', {
    websocketHost: process.env.WEBSOCKET_HOST || 'ws://localhost:3002',
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

app.listen(3001, function() {
  console.log('listening on *:3001');
});
