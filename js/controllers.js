/* global angular */

(function() {
    var appCtrls = angular.module('controllers', []);

    appCtrls.controller('IndexCtrl', function($scope, $routeParams, $location, gameSvc, playerSvc) {
        var gid = $routeParams.gid;

        if (gid) {
            gameSvc.loadByGid($routeParams.gid);
        } else {
            gameSvc.create();
        }

        $scope.addPlayer = function() {
            var player = playerSvc.create($scope.playerName);

            gameSvc.addPlayer(player);
            gameSvc.store(function() {
                $location.path('/day/' + player.pid);
            });
        };
    });

    appCtrls.controller('DayCtrl', function($scope, $routeParams, gameSvc) {
        var pid = $routeParams.pid;

        gameSvc.loadByPid(pid);

        $scope.behead = function() {
            console.log(this.$first);
            console.log(gameSvc.meIsActivePlayer());

            if (this.$first && gameSvc.meIsActivePlayer()) {
                gameSvc.behead();
                gameSvc.nextPlayer();
            }
        };

        $scope.startGame = function() {
            gameSvc.start();
        };
    });
})();

