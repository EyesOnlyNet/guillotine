/* global angular */

var app = angular.module('game', ['ngRoute', 'controllers', 'services']);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/index.php',
        controller: 'IndexCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
});
