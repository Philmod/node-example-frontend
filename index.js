var app = require('express')();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3001, function() {
  console.log('listening on *:3001');
});
