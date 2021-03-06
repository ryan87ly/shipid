var moment = require('moment');
var PluginStatus = require('./pluginstatus');
var plugins = {};
var ulutil = require('./util.js');
var util = require('util');

var Connector = function(server, mqClient){
	var self = this;
	this.io = require('socket.io')(server);
	this.mqClient = mqClient;

	mqClient.subscribe('log');
	mqClient.subscribe('heartbeat');

	mqClient.on('message', function(receivedData, delivery) {

		console.log('Recv Raw: %s', receivedData);
		var data  = ulutil.ensureJsonObject(receivedData);

		console.log('Recv: %s, %s', JSON.stringify(data), JSON.stringify(delivery));

		var topic = delivery.message.topic;

		if (topic === 'log') {
			self.io.emit('log', data);	
		} else if (topic === 'heartbeat'){
			var pluginName = data.pluginName;
			if(plugins[pluginName] === undefined) {
				var plugin = new PluginStatus(pluginName, "on");
				plugins[pluginName] = plugin;
				self.io.emit('pluginStatus', {pluginName: plugin.pluginName, status: plugin.status});

				plugin.on('onstatus', function(pluginStatus) {
					console.log("onstatus " + pluginStatus.pluginName + " " + pluginStatus.status);
					self.io.emit('pluginStatus', {pluginName: pluginStatus.pluginName, status: pluginStatus.status});
				});
			} else {
				plugins[pluginName].onHeartbeatReceived();
			}
	    } else {
			console.log('unhandle topic ' + JSON.stringify(data), JSON.stringify(delivery));
		}
	});
}

var logLevels = ["debug", "info", "warning", "error"];

var randomInt = function(num) {
	return Math.floor(Math.random() * num);
}

Connector.prototype.getPlugins = function() {
	var response = {};
	for(var pluginName in plugins) {
		var plugin = plugins[pluginName];
		response[pluginName] = {"pluginName": plugin.pluginName, "status": plugin.status};
	}
	return response;
}

Connector.prototype.start = function(){
	var self = this;
	self.io.on('connection', function(socket){
		console.log('a client connected ');
		var timerId = setInterval(function(){
			//console.log('sending message ');
			//socket.emit('log', {time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"), content:"Hi from " + moment().format("L"), level:logLevels[randomInt(4)], fromPlugin: plugins[randomInt(4)]});
			var usage = util.inspect(process.memoryUsage());

			socket.emit('log', {time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"), content: usage, level: "debug", fromPlugin: "Bridge", toPlugin:""});						
		}, 10000);

		socket.on('disconnect', function(){
			clearInterval(timerId);
		});

		socket.on('message', function(data){
			console.log('getting message ' + JSON.stringify(data));
			if(data) {
				var fromPlugin = data.fromPlugin;
				var topic = util.format("userRequest/%s", fromPlugin);
				self.mqClient.send(topic, data, function(error){
					console.log("Send error " + error);
				});
			}
		});
	});
}

module.exports = Connector;