define([], function() {
    'use strict';

    function StorageService() {
        return {
            setGame: setGame,
            getGame: getGame,
            setMyPlayerId: setMyPlayerId,
            getMyPlayerId: getMyPlayerId
        };

        function setGame(game) {
            sessionStorage.setItem('game', angular.toJson(game));
        }

        function getGame() {
            return angular.fromJson(sessionStorage.getItem('game'));
        }

        function setMyPlayerId(playerId) {
            sessionStorage.setItem('myPlayerId', angular.toJson(playerId));
        }

        function getMyPlayerId() {
            return angular.fromJson(sessionStorage.getItem('myPlayerId'));
        }
    }

    return StorageService;
});