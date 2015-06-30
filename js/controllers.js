/* global angular */

(function() {
    var appCtrls = angular.module('controllers', []);

    appCtrls.controller('IndexCtrl', function($scope, $location, gameSvc, playerSvc) {
        gameSvc.init();

        $scope.addPlayer = function() {
            var player = playerSvc.create($scope.playerName);

            gameSvc.addPlayer(player);
            gameSvc.store(function() {
                $location.path('/day/' + player.pid);
            });
        };
    });

    appCtrls.controller('DayCtrl', function($scope, $timeout, gameSvc) {
        gameSvc.init();

        var timeoutFunc = function() {
            if (!gameSvc.meIsActivePlayer()) {
                gameSvc.refresh();
            }

            $timeout(timeoutFunc, 5000);
        };

        $timeout(timeoutFunc, 5000);

        $scope.behead = function() {
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

