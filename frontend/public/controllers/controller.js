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
  $scope.messages = [];

  socket.on('message', function(data){
  	var displayableData = toDisplayableObject(data);
  	console.log("getting " + JSON.stringify(displayableData));
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
  }

  $scope.pluginSelect = {
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
  }
}]);