define([], function() {
    'use strict';

    function StorageService() {
        return {
            setGame: setGame,
            getGame: getGame,
            setMe: setMe,
            getMe: getMe
        };

        function setGame(game) {
            sessionStorage.setItem('game', angular.toJson(game));
        }

        function getGame() {
            return angular.fromJson(sessionStorage.getItem('game'));
        }

        function setMe(player) {
            sessionStorage.setItem('me', angular.toJson(player));
        }

        function getMe() {
            return angular.fromJson(sessionStorage.getItem('me'));
        }
    }

    return StorageService;
});