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

var suySidePush = function() {
	return {
		fromPlugin:"nodePlugin3",
		toPlugin:"nodePlugin_buyside_1", 
		msg:"ACCOUNT=3ax|CLIENTID=haha|CLORDID=9195770315000|CREATIONTIME=20151204022250|DMA.SAFEX.PRINCIPLE.AGENCY=P|EXCHANGECODE=ZAE000103454|MSGTYPE=new|ORDERQTY=15|ORDSTATUS=pendingnew|ORDTYPE=limit|PLUGINORIGINATOR=ULMsgSellPlugin|PLUGINOWNER=ULMsgSellPlugin|PRICE=15000|SIDE=buy|TRANSACTTIME=20151204102250315|"
	}
}


recvClient.on('started', function() {
	console.log("mq light started");
	/*recvClient.send('log', logData(), function(error){
		console.log("send error " + error);
	});*/

	/*recvClient.send('heartbeat', pluginHearbeat(), function(error){
		console.log("send error " + error);
	});*/

	/*recvClient.send('userRequest/nodePlugin3', pluginMessage(), function(error){
		console.log("send error " + error);
	});*/

	recvClient.send('pushMessage/nodePlugin_buyside_1', suySidePush(), function(error){
		console.log("send error " + error);
	});
});