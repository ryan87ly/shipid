var util = require('util');
var EventEmitter = require('events').EventEmitter;

var PluginStatus = function(pluginName, status) {
	EventEmitter.call(this);
	var self = this;
	this.pluginName = pluginName;
	this.status = status;
	this.timeoutObject = setTimeout(function(){
		self.onHeartbeatTimeout();
	}, 12000);
}

util.inherits(PluginStatus, EventEmitter);

PluginStatus.prototype.onHeartbeatReceived = function() {
	var self = this;
	clearTimeout(this.timeoutObject);
	this.timeoutObject = setTimeout(function(){
		self.onHeartbeatTimeout();
	}, 12000);
	if(this.status === "off") {
		this.status = "on";	
		this.emit("onstatus", this);
	}
	
}

PluginStatus.prototype.onHeartbeatTimeout = function () {
	this.status = "off";
	//console.log(this);
	this.emit("onstatus", this);
}

module.exports = PluginStatus;