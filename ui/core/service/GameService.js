define([], function() {
    'use strict';

    function GameService(GAME_CONFIG, GameResource, StorageService, UuidService, PlayerService, CardService) {
        var game;
        var actions = {
            behead1: behead,
            add3ToQueue: add3ToQueue,
            mixFirst5CardsOfQueue: mixFirst5CardsOfQueue,
            moveMarieToStart: moveMarieToStart,
            reverseQueue: reverseQueue,
            removeNobleFromQueue: removeNobleFromQueue
        };

        return {
            create: create,
            load: load,
            get: get,
            loadByPlayerId: loadByPlayerId,
            getPlayerById: getPlayerById,
            isGameEnded: isGameEnded,
            isDayEnded: isDayEnded,
            start: start,
            nextDay: nextDay,
            behead: behead,
            drawFromActionCardStack: drawFromActionCardStack,
            playActionCard: playActionCard,
            removeActionCard: removeActionCard,
            getActivePlayer: getActivePlayer,
            getActiveActionCards: getActiveActionCards
        };

        function create() {
            game = {
                id: UuidService.create(),
                day: 0,
                playerList: [],
                queue: [],
                activePlayerId: null,
                actionCardStack: [],
                nobleCardStack: [],
                playedActionCards: [],
                removedNobleCards: [],
                createdAt: new Date()
            };

            return game;
        }

        function get() {
            return game || load() || create();
        }

        function load() {
            game = StorageService.getGame();

            return game;
        }

        function loadByPlayerId(playerId) {
            return GameResource.query({'playerList.id': playerId}, {findOne: true});
        }

        function getPlayerById(id) {
            return game.playerList.filter(function(player) {
                return player.id === id;
            }).pop();
        }

        function isGameEnded() {
            return game.day > GAME_CONFIG.days;
        }

        function isDayEnded() {
            return game.day > 0 && game.queue.length === 0;
        }

        function start() {
            game.day = 1;
            game.actionCardStack = angular.copy(GAME_CONFIG.actionCards);
            game.nobleCardStack = angular.copy(GAME_CONFIG.nobleCards);

            CardService.mix(game.actionCardStack);
            CardService.mix(game.nobleCardStack);

            game.queue = CardService.draw(game.nobleCardStack, GAME_CONFIG.queueLength);

            game.playerList.forEach(function(player) {
                player.actionCards = CardService.draw(game.actionCardStack, GAME_CONFIG.actionCardsPerPlayer);
            });
        }

        function nextDay() {
            game.day += 1;
            game.queue = CardService.draw(game.nobleCardStack, GAME_CONFIG.queueLength);
        }

        function getActivePlayer() {
            return getPlayerById(game.activePlayerId);
        }

        function behead() {
            drawFromQueue();
            computeAllPoints();

            if (isDayEnded()) {
                nextDay();
            }
        }

        function drawFromQueue() {
            var activePlayer = getActivePlayer();
            var nobleCards = CardService.draw(game.queue, 1);

            activePlayer.nobleCards = Array.concat(activePlayer.nobleCards, nobleCards);

            var hasActionCard = activePlayer.activeActionCards.some(function(actionCard) {
                return actionCard.action === 'drawActionCardOnBeheadForVioletNoble';
            });

            var isViolet = nobleCards.some(function(nobleCard) {
                return nobleCard.color === 'violet';
            });

            if (hasActionCard && isViolet) {
                drawFromActionCardStack();
            }
        }

        function drawFromActionCardStack() {
            var activePlayer = getActivePlayer();

            activePlayer.actionCards = Array.concat(
                activePlayer.actionCards,
                CardService.draw(game.actionCardStack, 1)
            );
        }

        function computeAllPoints() {
            game.playerList.forEach(function(player) {
                PlayerService.computePoints(player);
            });
        }

        function getActiveActionCards() {
            var getActiveCards = function(player) {
                return player.activeActionCards;
            };

            return game.playerList.map(getActiveCards).reduce(function(a, b) {
                return a.concat(b);
            });
        }

        function playActionCard(card, options) {
            var activePlayer = getActivePlayer();
            var cardIndex = activePlayer.actionCards.indexOf(card);

            if(card.persistent) {
                activePlayer.activeActionCards.push(card);
            } else {
                actions[card.action](options);
                game.playedActionCards.push(card);
            }

            activePlayer.actionCards.splice(cardIndex, 1);
            computeAllPoints();
        }

        function removeActionCard(player, card) {
            var index = player.activeActionCards.indexOf(card);

            player.activeActionCards.splice(index, 1);
        }

        function add3ToQueue() {
            game.queue = game.queue.concat(CardService.draw(game.nobleCardStack, 3));
        }

        function mixFirst5CardsOfQueue() {
            var cards = game.queue.splice(0, 5);

            CardService.mix(cards);

            game.queue = cards.concat(game.queue);
        }

        function moveMarieToStart() {
            game.queue.forEach(function(card, index) {
                if (card.name === 'Marie Antoinette') {
                    game.queue.splice(index, 1);
                    game.queue.unshift(card);

                    return;
                }
            });
        }

        function reverseQueue() {
            game.queue = game.queue.reverse();
        }

        function removeNobleFromQueue(nobleCard) {
            var index = game.queue.indexOf(nobleCard);

            game.removedNobleCards.push(game.queue.splice(index, 1));
        }
    }

    return GameService;
});