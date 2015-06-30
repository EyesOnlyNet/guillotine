/* global angular */

(function() {
    var app = angular.module('gameApp', ['ngRoute', 'controllers', 'services']);

    app.config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/views/index.php',
            controller: 'IndexCtrl'
        })
        .when('/guest/:gid', {
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
})();
