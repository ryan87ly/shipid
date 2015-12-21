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