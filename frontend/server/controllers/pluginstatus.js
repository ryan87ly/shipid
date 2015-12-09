var util = require('util');
var EventEmitter = require('events').EventEmitter;

var PluginStatus = function(pluginName, status) {
	EventEmitter.call(this);
	var self = this;
	this.pluginName = pluginName;
	this.status = status;
	this.timeoutObject = setTimeout(function(){
		self.onHeartbeatTimeout();
	}, 10000);
}

util.inherits(PluginStatus, EventEmitter);

PluginStatus.prototype.onHeartbeatReceived = function() {
	var self = this;
	clearTimeout(this.timeoutObject);
	this.timeoutObject = setTimeout(function(){
		self.onHeartbeatTimeout();
	}, 10000);
	if(this.status === "off") {
		this.emit("onstatus", this);
		this.status = "on";	
	}
	
}

PluginStatus.prototype.onHeartbeatTimeout = function () {
	this.status = "off";
	//console.log(this);
	this.emit("onstatus", this);
}

PluginStatus.prototype.show = function() {
	console.log("show");
}



module.exports = PluginStatus;