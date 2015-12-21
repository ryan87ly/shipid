var mqlight = require('mqlight');
var moment = require('moment');
var util = require('util');
var ulutil = require('./util.js');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
var pluginName = config.pluginName;

var url = config.mqurl;

var userRequestTopic = util.format("userRequest/%s", pluginName);
console.log("UserRequest: %s", userRequestTopic);

var pushMessageTopic = util.format("pushMessage/%s", pluginName);
console.log("PushMessage: %s", pushMessageTopic);

var routeMessageTopic = "routeMessage";
var outboundTopic = util.format("outbound/%s", pluginName);


var recvClient = mqlight.createClient({service: url});
recvClient.on('started', function() {
	console.log("mq light started");

	recvClient.subscribe(userRequestTopic);
	recvClient.subscribe(pushMessageTopic);

	//send heartbeat
	setInterval(function(){
		recvClient.send('heartbeat', {"pluginName": pluginName})
	}, 2000);
});

recvClient.on('message', function(dataReceived, delivery) {
	var data = ulutil.ensureJsonObject(dataReceived);
	console.log('on message %s, %s', JSON.stringify(data), JSON.stringify(delivery));

	var topic = delivery.message.topic;

	if(topic === userRequestTopic){
		handleUserRequest(data);
	} else if(topic === pushMessageTopic) {
		handlePushMessage(data);
	} else {
		console.error('unhandled topic %s', topic);
	}
});


function handleUserRequest(data) {
	var time = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
	var level = "INFO";
	var content = util.format("RouteMessage : %s", data.msg);
	var logMessage = {time: time, level:level, fromPlugin:data.fromPlugin, toPlugin:data.toPlugin, content:content};
	console.log("Routing %s ", JSON.stringify(tobeSent));
	recvClient.send(routeMessageTopic, data);
	recvClient.send("log", tobeSent);
}

function handlePushMessage(data) {
	//handle and send outbound topic
	//recvClient.send(outboundTopic, data);
	var message = data.msg;
	var ulm = ulutil.convertToULM(message);
	var msgType = ulm["MSGTYPE"];
	var messageContent = {};
	if (msgType === "new") {
		messageContent = handleNew(ulm);
	} else {
		console.error("unexcepted message type %s ", msgType);
		return;
	}

	var ulmString = ulutil.toULMString(messageContent);

	//var tobeSent = 
	var time = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
	var level = "INFO";
	var content = util.format("RouteMessage : %s", ulmString);

	var logMessage = {time: time, level:level, fromPlugin:pluginName, toPlugin:data.fromPlugin, content:content};

	var bridgeMessage = {fromPlugin:pluginName, toPlugin:data.fromPlugin, msg:message};

	recvClient.send(routeMessageTopic, bridgeMessage);
	recvClient.send("log", logMessage);	
}


function handleNew(ulm) {
	var r = ulutil.cloneObject(ulm);
	r["ORDSTATUS"] = "new";
	r["MSGTYPE"] = "executionreport";
	r["TRANSACTIONTIME"] = moment().milliseconds().toString();
	r["EXECID"] = moment().milliseconds().toString();
	return r;
}

/*var logData = function() {
	return {time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"), content:"Hi from MQ!!!! " + moment().format("L"), level:logLevels[randomInt(4)]};
}

var pluginHearbeat = function() {
	return {pluginName: "plugin0"};
}*/

