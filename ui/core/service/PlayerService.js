define([], function() {
    'use strict';

    function PlayerService(UuidService) {
        return {
            create: create
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
    }

    return PlayerService;
});