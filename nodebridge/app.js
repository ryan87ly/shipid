var mqlight = require('mqlight');
var moment = require('moment');
var util = require('util');
var ulutil = require('./util.js');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

var url = config.mqurl;

var routeMessageTopic = "routeMessage";

var recvClient = mqlight.createClient({service: url});
recvClient.on('started', function() {
	console.log("mq light started");

	recvClient.subscribe(routeMessageTopic);
});

recvClient.on('message', function(dataReceived, delivery) {
	var data = ulutil.ensureJsonObject(dataReceived);
	console.log('on message %s, %s', JSON.stringify(data), JSON.stringify(delivery));

	var topic = delivery.message.topic;

	if(topic === routeMessageTopic){
		handleRouteMessage(data);
	} else {
		console.error('unhandled topic %s', topic);
	}
});


function handleRouteMessage(data) {
	var toPlugin = data.toPlugin;

	var pushMessageTopic = getPushMessageTopic(toPlugin);

	var time = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
	var level = "INFO";
	var content = util.format("PushMessage : %s", data.msg);
	var logMessage = {time: time, level:level, fromPlugin:data.fromPlugin, toPlugin:data.toPlugin, content:content};
	recvClient.send(pushMessageTopic, data);
	recvClient.send("log", logMessage);	
}

function getPushMessageTopic(pluginName) {
	return util.format("pushMessage/%s", pluginName);
}


/*var logData = function() {
	return {time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"), content:"Hi from MQ!!!! " + moment().format("L"), level:logLevels[randomInt(4)]};
}

var pluginHearbeat = function() {
	return {pluginName: "plugin0"};
}*/

