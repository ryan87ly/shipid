var Connector = function(server){
	this.io = require('socket.io')(server);
}

Connector.prototype.start = function(){
	this.io.on('connection', function(socket){
		console.log('a client connected');
	});
}

module.exports = Connector;