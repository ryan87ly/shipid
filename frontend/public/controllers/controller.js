var app = angular.module('myapp', []);

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

  
}]);