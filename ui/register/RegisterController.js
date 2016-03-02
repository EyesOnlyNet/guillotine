define([], function() {
    'use strict';

    function RegisterController(GameResource, GameService, PlayerService, StorageService, $state) {
        var vm = this;

        vm.playerName;
        vm.addPlayer = addPlayer;

        function addPlayer() {
            var game = GameService.create();
            var player = PlayerService.create(vm.playerName);

            game.playerList = [player];
            game.activePlayerId = player.id;

            (new GameResource(game)).$save().then(function() {
                StorageService.setGame(game);
                StorageService.setMyPlayerId(player.id);

                $state.go('playground');
            });
        };
    }

    return RegisterController;
});