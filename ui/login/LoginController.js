define([], function() {
    'use strict';

    function LoginController(GameService, settings, $state) {
        var vm = this;

        vm.playerId;
        vm.loadGameByPlayer = loadGameByPlayer;

        function loadGameByPlayer() {
            GameService.loadByPlayerId(vm.playerId).then(function(game) {
                settings.game = game;
                settings.me = game.playerList.filter(function(player) {
                    return player.id = vm.playerId;
                }).pop();

                $state.go('playground');
            });
        }
    }

    return LoginController;
});