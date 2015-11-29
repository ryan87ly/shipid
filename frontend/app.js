var express = require('express');
var app = express();
var Connector = require('./server/controllers/connector');


app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App is listening at http://%s:%s', host, port);
});

console.log("hello shit it day");
var connector = new Connector(server);
connector.start();

app.get('/', function(req, res){
  res.sendfile('public/views/index.html');
});