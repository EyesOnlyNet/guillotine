define([], function() {
    'use strict';

    function PlayerService(UuidService) {
        var player = {};
        var actions = {
            add2Points: add2Points,
            add1PointPerRedNoble: add1PointPerRedNoble,
            add1PointPerBlueNoble: add1PointPerBlueNoble,
            add1PointPerGreenNoble: add1PointPerGreenNoble,
            add1PointPerVioletNoble: add1PointPerVioletNoble,
            setBlackNoblePointsTo1: setBlackNoblePointsTo1
        };

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

        function computePoints(playerInstance) {
            player = playerInstance;
            player.points = 0;

            player.nobleCards.forEach(function(card) {
                player.points += card.points;
            });

            player.activeActionCards.forEach(function(card) {
                callAction(card.action);
            });
        }

        function callAction(action) {
            if (angular.isDefined(actions[action])) {
                actions[action]();
            }
        }

        function add2Points() {
            player.points += 2;
        }

        function adPointsPerNoble(cardColor) {
            player.points += player.nobleCards.filter(function(card) {
                return card.color === cardColor;
            }).length;
        }

        function add1PointPerRedNoble() {
            adPointsPerNoble('red');
        }

        function add1PointPerBlueNoble() {
            adPointsPerNoble('blue');
        }

        function add1PointPerGreenNoble() {
            adPointsPerNoble('green');
        }

        function add1PointPerVioletNoble() {
            adPointsPerNoble('violet');
        }

        function setBlackNoblePointsTo1() {
            player.nobleCards.forEach(function(card) {
                if(card.color === 'black') {
                    player.points += (card.points * -1) + 1;
                }
            });
        }
    }

    return PlayerService;
});