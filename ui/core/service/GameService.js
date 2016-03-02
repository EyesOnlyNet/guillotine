define([], function() {
    'use strict';

    function GameService(GAME_CONFIG, GameResource, StorageService, UuidService, PlayerService, CardService) {
        var game = {};

        return {
            create: create,
            set: set,
            get: get,
            load: load,
            loadByPlayerId: loadByPlayerId,
            getPlayerById: getPlayerById,
            isGameEnded: isGameEnded,
            isDayEnded: isDayEnded,
            start: start,
            nextDay: nextDay,
            behead: behead
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

        function set(gameInstance) {
            game = gameInstance;
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

        function behead(count) {
            var activePlayer = getPlayerById(game.activePlayerId);

            activePlayer.nobleCards.push(game.queue.splice(0, count).pop());
            activePlayer.points = 0;
            activePlayer.nobleCards.forEach(function(card) {
                activePlayer.points += card.points;
            });

            if (isDayEnded()) {
                nextDay();
            }
        }
    }

    return GameService;
});