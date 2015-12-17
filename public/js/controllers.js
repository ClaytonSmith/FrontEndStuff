'use strict';

/* Controllers


http://www.nganimate.org/angularjs/ng-repeat/appear
 */

var controllerRegister = angular.module('LinkHistory').controller;

controllerRegister( 'mainController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){
    $rootScope.users = [];
    $http.get('/api/get_users').success(function(users){
	$rootScope.users = users;
	console.log(users);
    });
}]);

controllerRegister( 'userViewerController', [ '$scope', '$rootScope', '$http', '$routeParams', function($scope, $rootScope, $http, $routeParams){
    
    console.log('Hello from user view controller');
    $scope.userId = $routeParams.userId;
    console.log($routeParams.userName, $scope.coolModel );
    
    // Should be put in mainController pre
    // has users? nothing : get usrs 
    
    // inject history
    // load users
    $scope.getDateString = function(date){
	var d = (new Date(new Date(0).setUTCSeconds(date))).toString().split(' ');
	return d[0] + ' ' +d[1] + ', '+d[2] + ' ' + d[3];
    }

    $scope.getTimeString = function(date){
	var d = (new Date(new Date(0).setUTCSeconds(date))).toString().split(' ');
	return d[4]
    }

    
    
    if( !$rootScope.users ){
	console.log('getting users');
	$http.get('/api/get_users').success(function(users){
	    $rootScope.users  = users;
	    $scope.activeUser = $rootScope.users.filter(function(user){return user._id === $scope.userId; })[0]
	});
    }
}]);
