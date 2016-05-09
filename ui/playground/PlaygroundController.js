define([], function () {
    'use strict';

    function PlaygroundController($state, $q, GameService, StorageService) {
        var vm = this;
        var interactions = {
            selectNobleFromQueue: prepareSelectNobleFromQueue,
            selectOwnHandActionCard: prepareSelectOwnHandActionCard
        };
        var resolveBehead;

        vm.game = GameService.get();
        vm.me = GameService.getPlayerById(StorageService.getMyPlayerId());
        vm.detailPlayer;
        vm.interactionCardInUse;
        vm.message;

        vm.start = start;
        vm.behead = behead;
        vm.queueClicked = void 0;
        vm.showPlayerDetails = showPlayerDetails;
        vm.closePlayerDetails = closePlayerDetails;
        vm.ownActionCardClicked = playActionCard;
        vm.isActionCardPlayable = isActionCardPlayable;
        vm.removeActiveActionCard = removeActiveActionCard;

        function start() {
            GameService.start();
        }

        function behead() {
            if (vm.game.day === 0) {
                return;
            }

            if (vm.interactionCardInUse) {
                return;
            }

            var promise = $q(function(resolve) {
                resolveBehead = resolve;
            });

            promise.then(function() {
                GameService.behead();
                GameService.drawFromActionCardStack(1);
                GameService.nextPlayer();

                if (GameService.isGameEnded()) {
                    $state.go('end');

                    return;
                }
            }, function() {
                console.warning('behead-promise failed');
            });

            if (angular.isDefined(vm.game.queue[0].interaction)) {
                vm.interactionCardInUse = vm.game.queue[0];
                interactions[vm.game.queue[0].interaction]();
            } else {
                resolveBehead();
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
            if (areActionCardsBlockedByQueue()) {
                return false;
            }

            if (card.changeQueue && isQueueBlocked()) {
                return false;
            }

            var criteria;

            switch(card.action) {
                case 'moveMarieToStart': {
                    criteria = function(nobleCard) {
                        return nobleCard.action === 'moveMarieToStart';
                    };
                    break;
                }
                case 'moveFirstBlueToFrontOfQueue': {
                    criteria = function(nobleCard) {
                        return nobleCard.color === 'blue';
                    };
                    break;
                }
            }

            return criteria ? vm.game.queue.some(criteria) : true;
        }

        function areActionCardsBlockedByQueue() {
            return vm.game.queue[0].action === 'blockActionCards';
        }

        function isQueueBlocked() {
            var isBlockingActionCard = function(actionCard) {
                return actionCard.action === 'blockQueue';
            };

            return GameService.getActiveActionCards().some(isBlockingActionCard);
        }

        function playActionCard(card) {
            if (!isActionCardPlayable(card)) {
                console.info('Card "' + card.name + '" is not playable.');
                return;
            }

            if (angular.isDefined(card.interaction)) {
                vm.interactionCardInUse = card;
                interactions[card.interaction]();
            } else {
                GameService.playActionCard(card);
            }
        }

        function resetInteraction() {
            vm.interactionCardInUse = void 0;
            vm.queueClicked = void 0;
            vm.ownActionCardClicked = playActionCard;
            vm.message = void 0;
        }

        function prepareSelectNobleFromQueue() {
            vm.queueClicked = selectNobleFromQueue;
            createMessage('info', 'Wähle eine Karte aus der Reihe, die du entfernen möchtest.');
        }

        function selectNobleFromQueue(card) {
            GameService.playActionCard(vm.interactionCardInUse, card);
            resetInteraction();
        }

        function prepareSelectOwnHandActionCard() {
            vm.ownActionCardClicked = selectOwnHandActionCard;
            createMessage('info', vm.interactionCardInUse.interactionText);
        }

        function selectOwnHandActionCard(card) {
            vm.game.queue[0].interactionResult = card;
            resetInteraction();
            resolveBehead();
        }
    }

    return PlaygroundController;
});