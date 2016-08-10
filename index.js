var app = require('express')();
var serverStatus = require('express-server-status');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use('/status', serverStatus(app));

app.listen(3001, function() {
  console.log('listening on *:3001');
});
