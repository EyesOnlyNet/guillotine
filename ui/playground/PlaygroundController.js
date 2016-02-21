define([], function() {
    'use strict';

    function PlaygroundController(GameService, StorageService) {
        var vm = this;

        vm.game = StorageService.getGame();
        vm.me = StorageService.getMe();

        GameService.start(vm.game);
    }

    return PlaygroundController;
});