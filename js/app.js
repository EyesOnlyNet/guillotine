/* global angular */

var app = angular.module('game', ['ngRoute', 'controllers', 'services']);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/index.php',
        controller: 'IndexCtrl'
    })
    .when('/day/:pid', {
        templateUrl: '/views/day.php',
        controller: 'DayCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
});
