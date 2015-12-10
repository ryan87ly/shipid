var express = require('express');
var app = express();
var Connector = require('./server/controllers/connector');
var mqlight = require('mqlight');

    
app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App is listening at http://%s:%s', host, port);
});

console.log("hello shit it day");


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

client.subscribe("channel1");
*/

//var url = 'amqp://192.168.246.179:5672';
//var url = 'amqp://192.168.246.163:6000';
var url = 'amqp://192.168.246.179:5672';

var recvClient = mqlight.createClient({service: url});

var connector = new Connector(server, recvClient);
connector.start();

app.get('/plugins', function(req, res){
    res.send(connector.getPlugins());
})

recvClient.on('started', function() {
	  console.log("mq light started");
	 
});

recvClient.on('error', function(error) {
  console.error('*** error ***');
  if (error) {
    /*if (error.message) console.error('message: %s', error.toString());
    else if (error.stack) console.error(error.stack);*/
    console.error(error.stack);
  }
});

