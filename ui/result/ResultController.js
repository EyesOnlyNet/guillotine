define([], function() {
    'use strict';

    function ResultController(GameService, StorageService) {
        var vm = this;

        vm.playerList = GameService.get().playerList;
        vm.me = GameService.getPlayerById(StorageService.getMyPlayerId());
    }

    return ResultController;
});