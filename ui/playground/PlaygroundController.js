define([], function() {
    'use strict';

    function PlaygroundController(GameService, settings) {
        var vm = this;

        vm.game = settings.game;
        vm.me = settings.me;
    }

    return PlaygroundController;
});