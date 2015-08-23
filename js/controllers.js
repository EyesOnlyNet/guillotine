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

    appCtrls.controller('DayCtrl', function($scope, gameSvc) {
        gameSvc.init();

        $scope.behead = function() {
            if (this.$first && gameSvc.meIsActivePlayer()) {
                gameSvc.behead();
            }
        };

        $scope.startGame = function() {
            gameSvc.start();
        };
    });

    appCtrls.controller('ResultCtrl', function(gameSvc) {
        gameSvc.init();
    });
})();

