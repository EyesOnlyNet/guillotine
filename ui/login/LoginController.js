define([], function() {
    'use strict';

    function LoginController(GameService, StorageService, $state) {
        var vm = this;

        vm.playerId;
        vm.loadGameByPlayer = loadGameByPlayer;

        function loadGameByPlayer() {
            GameService.loadByPlayerId(vm.playerId).then(function(game) {
                var me = game.playerList.filter(function(player) {
                    return player.id === vm.playerId;
                }).pop();

                StorageService.setGame(game);
                StorageService.setMeId(me.id);

                $state.go('playground');
            });
        }
    }

    return LoginController;
});