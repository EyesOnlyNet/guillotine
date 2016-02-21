define([], function() {
    'use strict';

    function GameService(GAME_CONFIG, ACTION_CARDS, GameResource, UuidService, CardService) {
        return {
            create: create,
            start: start,
            loadByPlayerId: loadByPlayerId
        };

        function create() {
            return new GameResource({
                id: UuidService.create(),
                day: 0,
                playerList: [],
                queue: [],
                activePlayer: null,
                actionCardStack: [],
                nobleCardStack: [],
                playedActionCards: [],
                removedNobleCards: [],
                createdAt: new Date()
            });
        }

        function start(game) {
            game.day = 1;
            game.actionCardStack = CardService.mix(ACTION_CARDS);
        }

        function loadByPlayerId(playerId) {
            return GameResource.query({'playerList.id': playerId}, {findOne: true});
        }
    }

    return GameService;
});