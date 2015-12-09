var mqlight = require('mqlight');
var moment = require('moment');
var util = require('util');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
var pluginName = config.pluginName;

var url = config.mqurl;


var recvClient = mqlight.createClient({service: url});
recvClient.on('started', function() {
	console.log("mq light started");

	setInterval(function(){
		recvClient.send('heartbeat', {"pluginName": pluginName})
	}, 2000);
});

recvClient.on('message', function(data, delivery) {
	console.log('on message %s, %s', JSON.stringify(data), JSON.stringify(delivery));

	//recvClient.send('routeMessage', )
});

var topicFormat = util.format("%s/+", pluginName);
console.log(topicFormat);
recvClient.subscribe(topicFormat);


/*var logData = function() {
	return {time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"), content:"Hi from MQ!!!! " + moment().format("L"), level:logLevels[randomInt(4)]};
}

var pluginHearbeat = function() {
	return {pluginName: "plugin0"};
}*/

