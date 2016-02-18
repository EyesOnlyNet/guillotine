define([], function() {
    'use strict';

    function GameService(GAME_CONFIG, GameResource, UuidService) {
        return {
            create: create,
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
                playedActionCards: [],
                nobleCardStack: [],
                removedNobleCards: [],
                createdAt: new Date()
            });
        }

        function loadByPlayerId(playerId) {
            return GameResource.query({'playerList.id': playerId}, {findOne: true});
        }
    }

    return GameService;
});