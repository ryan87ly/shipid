var util = require('util');

module.exports.ensureJsonObject = function(input) {
	if (typeof(input) === 'object') {
		return input;
	} else if (typeof(input) === 'string') {
		return JSON.parse(input);
	} else {
		console.error("unexpeceted receivedData " + input);
		return {};
	}
}

module.exports.convertToULM = function(msg) {
	var ulm = {};
	var res = msg.split('|');
	res.forEach(function(pair) {
		if(pair) {
			var kv = pair.split('=');
			ulm[kv[0].toUpperCase()] = kv[1];
		}
	})
	return ulm;
}

module.exports.toULMString = function(ulm) {
	var result = "";
	for(var key in ulm) {
		result += util.format("%s=%s|", key, ulm[key]);
	}
	return result;
}

module.exports.cloneObject = function(o) {
	return JSON.parse(JSON.stringify(o));
}