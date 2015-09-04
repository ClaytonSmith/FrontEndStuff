'use strict';

/* Controllers


http://www.nganimate.org/angularjs/ng-repeat/appear
 */

var controllerRegister = angular.module('LinkHistory').controller;

controllerRegister( 'mainController', ['$scope', '$http', function($scope, $http){
    
}]);

controllerRegister( 'userViewerController', [ '$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $scope.user = {
	userName: $routeParams.userName,
	linkCount: $routeParams.userName.length,
	favoriteDomain: 'www.google.com',
	daysOnRecord: 165,
	recentLink: 'www.google.com'
    }

    console.log('Hello from user view controller');
    $scope.userName = $routeParams.userName;
    console.log($routeParams.userName, $scope.coolModel );
}]);
