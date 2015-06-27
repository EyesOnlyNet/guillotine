/* global angular */

(function() {
    var appCtrls = angular.module('controllers', []);

    appCtrls.controller('IndexCtrl', function($scope, $rootScope, $location, dbSvc) {
        $scope.createGame = function() {
            var game = new Game(),
                me = new Player($scope.playerName);

            game.playerList.push(me);

            dbSvc.createGame(game, function() {
                $rootScope.game = game;
                $rootScope.me = me;

                $location.path('/day/' + me.pid);
            });
        };
    });

    appCtrls.controller('DayCtrl', function($scope, $rootScope, $routeParams, dbSvc, gameSvc) {
        if (!$rootScope.game) {
            var pid = $routeParams.pid;

            dbSvc.readGame({'playerList.pid': pid}, function(game) {
                $rootScope.game = game;
                $rootScope.me = game.playerList.filter(function(player) {
                    return player.pid === pid;
                }).pop();
            });
        }

        $scope.behead = function() {
            this.$first && gameSvc.behead();
        };
    });
})();

