define([], function() {
    'use strict';

    function PlayerService(UuidService, EventService) {
        return {
            create: create,
            computePoints: computePoints
        };

        function create(name) {
            return {
                id: UuidService.create(),
                name: name,
                points: 0,
                nobleCards: [],
                actionCards: [],
                actionCardPlayed: false,
                activeActionCards: []
            };
        }

        function computePoints(player) {
            player.points = 0;
            player.nobleCards.forEach(function(card) {
                player.points += card.points;
            });

            EventService.send('afterCalculation', player);
        }
    }

    return PlayerService;
});