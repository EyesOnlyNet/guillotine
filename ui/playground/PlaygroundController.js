define([], function() {
    'use strict';

    function PlaygroundController(GameService, StorageService, $state) {
        var vm = this;

        GameService.load();

        vm.game = GameService.get();
        vm.me = GameService.getPlayerById(StorageService.getMyPlayerId());
        vm.detailPlayer;

        vm.start = start;
        vm.behead = behead;
        vm.showPlayerDetails = showPlayerDetails;
        vm.closePlayerDetails = closePlayerDetails;
        vm.playActionCard = playActionCard;

        function start() {
            GameService.start();
        }

        function behead() {
            GameService.behead(1);

            if (GameService.isGameEnded()) {
                $state.go('end');
            }
        }

        function showPlayerDetails(id) {
            vm.detailPlayer = GameService.getPlayerById(id);
        }

        function closePlayerDetails() {
            vm.detailPlayer = void 0;
        }

        function playActionCard(card) {
            GameService.playActionCard(card);
        }
    }

    return PlaygroundController;
});