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
        .when('/results/:gid', {
            templateUrl: '/views/results.php',
            controller: 'ResultCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
    });

    app.run(function($rootScope, $timeout, $location, gameSvc) {
        var watch = false;

        $rootScope.refresh = function() {
            if (!watch) {
                watch = true;

                if (gameSvc.endReached()) {
                    return;
                    $location.path('/results/' + gameSvc.getGid());
                }

                if ($rootScope.me && !gameSvc.meIsActivePlayer()) {
                    gameSvc.refresh();
                }

                $timeout(function() {
                    watch = false;
                }, 5000);
            }
        };
    });
})();
