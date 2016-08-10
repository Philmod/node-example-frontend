var app = require('express')();
var morgan = require('morgan');
var serverStatus = require('express-server-status');

app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/status', serverStatus(app));

app.listen(3001, function() {
  console.log('listening on *:3001');
});
