/* global angular */

var appCtrls = angular.module('controllers', []);

appCtrls.controller('IndexCtrl', function($scope, db) {
    $scope.createGame = function() {
        var game = new Game();

        game.playerList.push(new Player($scope.name));

        db.saveGame(game);
    };
});
