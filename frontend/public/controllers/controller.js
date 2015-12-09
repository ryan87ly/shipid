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