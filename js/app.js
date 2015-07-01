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

    app.run(function($rootScope, $timeout, gameSvc) {
        var timeoutFunc = function() {
            if (gameSvc.meIsActivePlayer()) {
                watch = false;
            } else {
                gameSvc.refresh();
            }

            $timeout(timeoutFunc, 5000);
        },
        watch = false;

        $rootScope.refresh = function() {
            if (!gameSvc.meIsActivePlayer() && !watch) {
                watch = true;
                $timeout(timeoutFunc, 5000);
            }
        };
    });
})();
