define([], function() {
    'use strict';

    function RegisterController(Game) {
        var vm = this;

        vm.playerName;
        vm.addPlayer = addPlayer;

        function addPlayer() {
            var game = new Game();

            game.playerList = [{name: vm.playerName}];
            game.$save();
        };
    }

    return RegisterController;
});