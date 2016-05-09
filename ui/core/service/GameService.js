define([], function () {
    'use strict';

    function GameService(GAME_CONFIG, GameResource, StorageService, UuidService, PlayerService, CardService) {
        var game;
        var actions = {
            behead1: behead,
            add1ToQueue: add1ToQueue,
            add3ToQueue: add3ToQueue,
            mixFirst5CardsOfQueue: mixFirst5CardsOfQueue,
            remixQueue: remixQueue,
            moveMarieToStart: moveMarieToStart,
            moveFirstBlueToFrontOfQueue: moveFirstBlueToFrontOfQueue,
            moveFirstToEnd: moveFirstNobleToEnd,
            moveSelfToEndOfQueue: moveSelfToEndOfQueue,
            reverseQueue: reverseQueue,
            removeNobleFromQueue: removeNobleFromQueue,
            endDay: endDay,
            draw1ActionCard: draw1ActionCard,
            draw1FromNobleStack: draw1FromNobleStack,
            resetActionCards: resetActionCards,
            draw3ActionCardsAndEndTurn: draw3ActionCardsAndEndTurn,
            draw1ActionCardForVioletNoble: draw1ActionCardForVioletNoble,
            removeOwnHandActionCard: removeOwnHandActionCard
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
            nextPlayer: nextPlayer,
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
            return game.playerList.filter(function (player) {
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

            initPlayersWithActionCards();
        }

        function initPlayersWithActionCards() {
            game.playerList.forEach(function (player) {
                player.actionCards = CardService.draw(
                    game.actionCardStack,
                    GAME_CONFIG.actionCardsPerPlayer
                );
            });
        }

        function nextPlayer() {
            var activePlayer = getActivePlayer();
            var endOfTurnActionCards = activePlayer.activeActionCards.filter(function(card) {
                return card.strategy === 'onEndOfTurn';
            });

            endOfTurnActionCards.forEach(function(card) {
                callAction(card.action);
                
                if (!card.persistent) {
                    removeActionCard(activePlayer, card);
                }
            });

            // todo switch to next player
        }

        function nextDay() {
            game.day += 1;
            game.removedNobleCards = game.removedNobleCards.concat(game.queue);
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

            activePlayer.nobleCards = Array.concat(
                activePlayer.nobleCards,
                nobleCards
            );

            nobleCards.forEach(function (card) {
                if (card.strategy === 'afterBehead') {
                    callAction(card.action, card);
                }
            });

            activePlayer.activeActionCards.forEach(function (card) {
                if (card.strategy === 'afterBehead') {
                    callAction(card.action, nobleCards);
                }
            });
        }

        function drawFromActionCardStack(count) {
            var activePlayer = getActivePlayer();

            activePlayer.actionCards = Array.concat(
                activePlayer.actionCards,
                CardService.draw(game.actionCardStack, count)
            );
        }

        function drawFromNobleCardStack() {
            var activePlayer = getActivePlayer();

            activePlayer.nobleCards = Array.concat(
                activePlayer.nobleCards,
                CardService.draw(game.nobleCardStack, 1)
            );
        }

        function computeAllPoints() {
            game.playerList.forEach(function (player) {
                PlayerService.computePoints(player);
            });
        }

        function getActiveActionCards() {
            var getActiveCards = function (player) {
                return player.activeActionCards;
            };

            var concatCards = function(stack1, stack2) {
                return stack1.concat(stack2);
            }

            return game.playerList.map(getActiveCards).reduce(concatCards);
        }

        function playActionCard(card, options) {
            var activePlayer = getActivePlayer();
            var cardIndex = activePlayer.actionCards.indexOf(card);

            activePlayer.actionCards.splice(cardIndex, 1);

            if (card.persistent || card.strategy === 'onEndOfTurn') {
                activePlayer.activeActionCards.push(card);
            } else if (card.strategy === 'direct') {
                callAction(card.action, options);
                game.playedActionCards.push(card);
            }

            game.queue.forEach(function(card) {
                if (card.strategy === 'afterPlayedActionCard') {
                    callAction(card.action, card);
                }
            });

            computeAllPoints();
        }

        function callAction(action, options) {
            if (angular.isDefined(actions[action])) {
                console.info(action);
                actions[action](options);
            } else {
                console.warn(action + ' is not defined.');
            }
        }

        function removeActionCard(player, card) {
            var index = player.activeActionCards.indexOf(card);

            player.activeActionCards.splice(index, 1);
            game.playedActionCards.push(card);
        }

        function add1ToQueue() {
            game.queue = Array.concat(
                game.queue,
                CardService.draw(game.nobleCardStack, 1)
            );
        }

        function add3ToQueue() {
            game.queue = Array.concat(
                game.queue,
                CardService.draw(game.nobleCardStack, 3)
            );
        }

        function mixFirst5CardsOfQueue() {
            var cards = game.queue.splice(0, 5);

            CardService.mix(cards);

            game.queue = Array.concat(cards, game.queue);
        }

        function remixQueue() {
            var count = game.queue.length;

            game.nobleCardStack = Array.concat(
                game.nobleCardStack,
                game.queue
            );

            CardService.mix(game.nobleCardStack);

            game.queue = CardService.draw(game.nobleCardStack, count);
        }

        function moveMarieToStart() {
            game.queue.some(function (card, index) {
                if (card.name === 'Marie Antoinette') {
                    game.queue.splice(index, 1);
                    game.queue.unshift(card);

                    return true;
                }
            });
        }

        function moveFirstBlueToFrontOfQueue() {
            game.queue.some(function (card, index) {
                if (card.color === 'blue') {
                    game.queue.splice(index, 1);
                    game.queue.unshift(card);

                    return true;
                }
            });
        }

        function moveFirstNobleToEnd() {
            var card = game.queue.splice(0, 1);

            game.queue = Array.concat(game.queue, card);
        }

        function moveSelfToEndOfQueue(card) {
            game.queue.splice(game.queue.indexOf(card), 1);
            game.queue.push(card);
        }

        function reverseQueue() {
            game.queue = game.queue.reverse();
        }

        function removeNobleFromQueue(nobleCard) {
            var index = game.queue.indexOf(nobleCard);

            game.removedNobleCards.push(game.queue.splice(index, 1));
        }

        function endDay() {
            nextDay();
        }

        function draw1ActionCard() {
            drawFromActionCardStack(1);
        }

        function draw1ActionCardForVioletNoble(beheadCards) {
            beheadCards.forEach(function (card) {
                if (card.color === 'violet') {
                    drawFromActionCardStack(1);
                }
            });
        }

        function draw1FromNobleStack() {
            drawFromNobleCardStack();
        }

        function resetActionCards() {
            game.playerList.forEach(function (player) {
                game.actionCardStack = Array.concat(
                    game.actionCardStack,
                    CardService.draw(player.actionCards, player.actionCards.length)
                );
            });

            CardService.mix(game.actionCardStack);

            initPlayersWithActionCards();
        }

        function draw3ActionCardsAndEndTurn() {
            drawFromActionCardStack(3);
            nextPlayer();
        }

        function removeOwnHandActionCard(card) {
            removeActionCard(getActivePlayer(), card.interactionResult);
        }
    }

    return GameService;
});