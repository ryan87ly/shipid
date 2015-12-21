var app = angular.module('myapp', ['ngAnimate', 'ui.bootstrap']);

app.factory('socket', function($rootScope){
	var socket = io.connect();
	return {
		on : function(eventName, callback) {
			socket.on(eventName, function () {  
		        var args = arguments;
		        $rootScope.$apply(function () {
		          callback.apply(socket, args);
		        });
		    });
		},
		emit: function (eventName, data, callback) {
	      socket.emit(eventName, data, function () {
	        var args = arguments;
	        $rootScope.$apply(function () {
	          if (callback) {
	            callback.apply(socket, args);
	          }
	        });
	      })
	    }
	};
});
  

app.controller('frondendCtrl', ['$scope', '$http', 'socket', function ($scope, $http, socket) {
  var max_buffer = 25;
  $scope.messages = [];

  socket.on('log', function(data){
    var displayableData = toDisplayableObject(data);
    console.log("getting log " + JSON.stringify(displayableData));
	if ($scope.messages.length >= max_buffer){
		$scope.messages.shift();
	}
    	$scope.messages.push(displayableData);

  })

  socket.on('pluginStatus', function(data){
      console.log("getting pluginStatus " + JSON.stringify(data));
      /*
        data {
           pluginName : "plugin0",
           status: "on" // on/off
        }
      */
      $scope.plugins[data.pluginName] = data;
  });

  $scope.plugins = {};
  $http.get('/plugins', {}).then(function(response){
      $scope.plugins = response.data;
  });

  $scope.send = function(input) {
  	 //console.log("send message: " + JSON.stringify(msg));
     var msg = {
        "fromPlugin" : input.fromPlugin.pluginName,
        "toPlugin" : input.toPlugin.pluginName,
        "msg" : input.msg
     }
     console.log("send message: " + JSON.stringify(msg));
     socket.emit("message", msg);
  }
  
    $scope.checkColor = function(status) {
    console.log("checkColor : " + status);
    if (status == "on") {
        return "green";
    }
    return "red";
  }

  $scope.checkSendMessage = function(msg) {
    if (msg.fromPlugin && msg.fromPlugin.pluginName && msg.toPlugin && msg.toPlugin.pluginName && msg.msg) {
        return false;
    }
    return true;
  }
}]);