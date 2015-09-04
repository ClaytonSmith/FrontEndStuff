'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('LinkHistory', [
    'ngRoute',
    'ngResource',
    'LinkHistory.filters',
    'LinkHistory.services',
    'LinkHistory.directives'    
]);

app.config(['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider){

    $routeProvider.when('/',               {templateUrl: 'partials/body', controller: 'mainController'});
    $routeProvider.when('/user/:userName', {templateUrl: 'partials/user-tile', controller: 'userViewerController' });
    
    //$routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
}]);
