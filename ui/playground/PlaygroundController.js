define([], function () {
    'use strict';

    function PlaygroundController($state, GameService, StorageService) {
        var nobleCardIdMarie = 14;
        var actionCardIdBlockQueue = 6;
        var nobleCardIdsChangingQueue = [1, 2, 4, 5, 7, 13];

        var vm = this;
        var interactions = {
            selectNobleFromQueue: prepareSelectNobleFromQueue
        };

        vm.game = GameService.get();
        vm.me = GameService.getPlayerById(StorageService.getMyPlayerId());
        vm.detailPlayer;
        vm.actionCardInUse;
        vm.message;

        vm.start = start;
        vm.behead = behead;
        vm.queueClicked = void 0;
        vm.showPlayerDetails = showPlayerDetails;
        vm.closePlayerDetails = closePlayerDetails;
        vm.playActionCard = playActionCard;
        vm.isActionCardPlayable = isActionCardPlayable;
        vm.removeActiveActionCard = removeActiveActionCard;

        function start() {
            GameService.start();
        }

        function behead() {
            if (vm.actionCardInUse) {
                return;
            }

            GameService.behead();
            GameService.drawFromActionCardStack();

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

        function removeActiveActionCard(card) {
            if(!card.removable) {
                console.info('Card ' + card.name + 'is not removable.');
            }

            GameService.removeActionCard(vm.me, card);
        }

        function isActionCardPlayable(card) {
            if (isQueueChangingCard(card) && isQueueBlocked()) {
                return false;
            }

            switch(card.action) {
                case 'moveMarieToStart': {
                    var isMarie = function(nobleCard) {
                        return nobleCard.id === nobleCardIdMarie;
                    };

                    return vm.game.queue.some(isMarie);
                }
            }

            return true;
        }

        function isQueueChangingCard(card) {
            return nobleCardIdsChangingQueue.indexOf(card.id) !== -1;
        }

        function isQueueBlocked() {
            var isBlockingActionCard = function(actionCard) {
                return actionCard.id === actionCardIdBlockQueue;
            };

            return GameService.getActiveActionCards().some(isBlockingActionCard);
        }

        function playActionCard(card) {
            if (!isActionCardPlayable(card)) {
                console.info('Card "' + card.name + '" is not playable.');
                return;
            }

            if (angular.isDefined(card.interaction)) {
                vm.actionCardInUse = card;
                interactions[card.interaction]();
            } else {
                GameService.playActionCard(card);
            }
        }

        function prepareSelectNobleFromQueue() {
            vm.queueClicked = selectNobleFromQueue;
            createMessage('info', 'Wähle eine Karte aus der Reihe, die du entfernen möchtest.');
        }

        function selectNobleFromQueue(card) {
            GameService.playActionCard(vm.actionCardInUse, card);
            vm.actionCardInUse = void 0;
            vm.queueClicked = void 0;
            vm.message = void 0;
        }
    }

    return PlaygroundController;
});