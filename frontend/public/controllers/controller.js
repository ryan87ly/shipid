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
  
app.controller('frondendCtrl', ['$scope', 'socket', function ($scope, socket) {
  var max_buffer = 25;
  $scope.messages = [];

  socket.on('message', function(data){
  	var displayableData = toDisplayableObject(data);
  	console.log("getting " + JSON.stringify(displayableData));
	if ($scope.messages.length >= max_buffer){
		$scope.messages.shift();
	}
  	$scope.messages.push(displayableData);
  })

  $scope.plugins = function get(){
  	 var result = [];
  	 for(var i = 0; i < 5; ++ i){
  	 	result.push("plugin " + i);
  	 }
  	 return result;
  }();

  $scope.send = function(msg) {
  	 console.log("send message: " + JSON.stringify(msg));
     socket.emit("message", msg);
  }

  $scope.checkSendMessage = function(msg) {
    console.log("check " + JSON.stringify(msg));
    if (msg.fromplugin && msg.toplugin && msg.content) {
        return false;
    }
    return true;
  }

  /*$scope.pluginSelect = {
  	 fromPlugin : false,
  	 toPlugin : false
  };

  $scope.pluginSelection = {
  	 toPlugin : "Select Plugin",
  	 fromPlugin : "Select Plugin",
  }

  $scope.onClickToPlugin = function(pluginName) {
  	 $scope.pluginSelection.toPlugin = pluginName;
  	 console.log("onClickToPlugin: " + pluginName);
  }

  $scope.onClickFromPlugin = function(pluginName) {
  	$scope.pluginSelection.fromPlugin = pluginName;
  	console.log("onClickFromPlugin: " + pluginName);
  }*/
}]);