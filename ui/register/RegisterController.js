define([], function() {
    'use strict';

    function RegisterController(GameService, PlayerService, settings, $state) {
        var vm = this;

        vm.playerName;
        vm.addPlayer = addPlayer;

        function addPlayer() {
            var game = GameService.create();
            var player = PlayerService.create(vm.playerName);

            game.playerList = [player];
            game.activePlayer = player;

            game.$save().then(function() {
                settings.game = game;
                settings.me = player;

                $state.go('playground');
            });
        };
    }

    return RegisterController;
});