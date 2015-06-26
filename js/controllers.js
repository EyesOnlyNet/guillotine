/* global angular */

var appCtrls = angular.module('controllers', []);

appCtrls.controller('IndexCtrl', function($scope, $rootScope, $location, db) {
    $scope.createGame = function() {
        var game = new Game(),
            me = new Player($scope.playerName);

        game.playerList.push(me);

        db.createGame(game, function() {
            $rootScope.game = game;
            $rootScope.me = me;

            $location.path('/day/' + me.pid);
        });
    };
});

appCtrls.controller('DayCtrl', function($scope, $rootScope, $routeParams, db) {
    if (!$rootScope.game) {
        var pid = $routeParams.pid;

        db.readGame({'playerList.pid': pid}, function(game) {
            $rootScope.game = game;
            $rootScope.me = game.playerList.filter(function(player) {
                return player.pid === pid;
            }).pop();
        });
    }
});
