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

/*
var redis = require("redis");
var client = redis.createClient({host:"localhost", port:6379});
client.on("error", function (err) {
    console.log("Error " + err);
});


client.on("subscribe", function (channel, count) {
	console.log("subscribe success " + channel);
});

client.on("message", function (channel, message) {
	console.log("get message from " + channel + " " + message);
});

client.subscribe("channel1");*/