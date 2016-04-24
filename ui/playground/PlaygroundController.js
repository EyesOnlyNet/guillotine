define([], function() {
    'use strict';

    function PlaygroundController($state, GameService, StorageService) {
        var vm = this;
        var interactions = {
            selectNobleFromQueue: prepareSelectNobleFromQueue
        };

        GameService.load();

        vm.game = GameService.get();
        vm.me = GameService.getPlayerById(StorageService.getMyPlayerId());
        vm.detailPlayer;
        vm.actionCardInUse;
        vm.message;

        vm.start = start;
        vm.queueClicked = behead;
        vm.showPlayerDetails = showPlayerDetails;
        vm.closePlayerDetails = closePlayerDetails;
        vm.playActionCard = playActionCard;

        function start() {
            GameService.start();
        }

        function behead() {
            GameService.behead();

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

        function createMessage(type, text) {
            vm.message = {
                type: type,
                text: text
            };
        }

        function playActionCard(card) {
            if(angular.isDefined(card.interaction)) {
                vm.actionCardInUse = card;
                interactions[card.interaction]();
            } else {
                GameService.playActionCard(card);
            }
        }

        function prepareSelectNobleFromQueue() {
            vm.queueClicked = selectNobleFromQueue;
            closePlayerDetails();
            createMessage('info', 'Wähle eine Karte aus der Reihe, die du entfernen möchtest.');
        }

        function selectNobleFromQueue(card) {
            GameService.playActionCard(vm.actionCardInUse, card);
            vm.actionCardInUse = void 0;
            vm.queueClicked = behead;
            vm.message = void 0;
        }
    }

    return PlaygroundController;
});