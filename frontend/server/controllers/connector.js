var moment = require('moment');

var Connector = function(server){
	this.io = require('socket.io')(server);
}

var logLevels = ["debug", "info", "warning", "error"];

var randomInt = function(num) {
	return Math.floor(Math.random() * num);
}

Connector.prototype.start = function(){
	this.io.on('connection', function(socket){
		console.log('a client connected ');
		var timerId = setInterval(function(){
			console.log('sending message ');
			socket.send({time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"), content:"Hi from " + moment().format("L"), level:logLevels[randomInt(4)]});
		}, 1000);

		socket.on('disconnect', function(){
			clearInterval(timerId);
		});

		socket.on('message', function(data){
			console.log('getting message ' + JSON.stringify(data));
		});
	});
}

module.exports = Connector;