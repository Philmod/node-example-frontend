var app = require('express')();
var os = require('os');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var serverStatus = require('express-server-status');

app.use(morgan('dev'));
app.engine('hbs', exphbs());
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render(__dirname + '/index.hbs', {
    htmlserver: os.hostname()
  });
});

app.use('/status', serverStatus(app));

app.listen(3001, function() {
  console.log('listening on *:3001');
});
