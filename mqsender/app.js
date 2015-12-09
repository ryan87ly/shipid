var mqlight = require('mqlight');
var moment = require('moment');


var url = 'amqp://localhost:6000';

var logLevels = ["debug", "info", "warning", "error"];

var randomInt = function(num) {
	return Math.floor(Math.random() * num);
}

var recvClient = mqlight.createClient({service: url});
var logData = function() {
	return {time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"), content:"Hi from MQ!!!! " + moment().format("L"), level:logLevels[randomInt(4)]};
}

var pluginHearbeat = function() {
	return {pluginName: "plugin0"};
}

var pluginMessage = function() {
	return {fromPlugin:"plugin0", toPlugin:"nodeplugin1", msg:"hahahahahah"};
}


recvClient.on('started', function() {
	console.log("mq light started");
	/*recvClient.send('log', logData(), function(error){
		console.log("send error " + error);
	});*/

	/*recvClient.send('heartbeat', pluginHearbeat(), function(error){
		console.log("send error " + error);
	});*/

	recvClient.send('nodeplugin1/userRequest', pluginMessage(), function(error){
		console.log("send error " + error);
	});
});