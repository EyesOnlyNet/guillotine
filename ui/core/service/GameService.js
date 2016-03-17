define([], function() {
    'use strict';

    function GameService(GAME_CONFIG, GameResource, StorageService, UuidService, PlayerService, CardService) {
        var game = {};
        var actions = {
            behead1: behead
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
            playActionCard: playActionCard,
            getActivePlayer: getActivePlayer
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
            return game;
        }

        function load() {
            game = StorageService.getGame();
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
            var activePlayer = getActivePlayer();

            activePlayer.nobleCards.push(game.queue.splice(0, 1).pop());
            computeAllPoints();

            if (isDayEnded()) {
                nextDay();
            }
        }

        function computeAllPoints() {
            game.playerList.forEach(function(player) {
                PlayerService.computePoints(player);
            });
        }

        function playActionCard(card) {
            var activePlayer = getActivePlayer();
            var cardIndex = activePlayer.actionCards.indexOf(card);

            if(card.persistent) {
                activePlayer.activeActionCards.push(card);
            } else {
                callAction(card.action);

                game.playedActionCards.push(card);
            }

            activePlayer.actionCards.splice(cardIndex, 1);
            computeAllPoints();
        }

        function callAction(action) {
            actions[action]();
        }
    }

    return GameService;
});