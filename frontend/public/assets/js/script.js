var bgmapping = {
	"debug" : "active",
	"info" : "info",
	"warning" : "warning",
	"error" : "danger"
}

var toDisplayableObject = function(messageObject) {
	var level = messageObject.level.toLowerCase();
	if (bgmapping[level] === undefined) {
		messageObject.type = "";
	} else {
		messageObject.type = bgmapping[level];
	}
	return messageObject;
}
