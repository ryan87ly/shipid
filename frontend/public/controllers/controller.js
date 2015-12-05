var app = angular.module('myapp', []);

app.factory('socket', function($rootScope){
	var socket = io.connect();
	return {
		on : function(eventName, callback) {
			socket.on(eventName, callback);
		}
	};
});

app.controller('PhoneListCtrl', ['$scope', 'socket', function ($scope, socket) {
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];

  socket.on('message', function(data){
  	console.log("getting data " + data);
  })

}]);