define([], function () {
    'use strict';

    function PlayerService(UuidService) {
        var player = {};
        var actions = {
            add1PointPerRedNoble: add1PointPerRedNoble,
            add1PointPerBlueNoble: add1PointPerBlueNoble,
            add1PointPerGreenNoble: add1PointPerGreenNoble,
            add1PointPerVioletNoble: add1PointPerVioletNoble,
            setBlackNoblePointsTo1: setBlackNoblePointsTo1,
            addPointsForGuards: addPointsForGuards,
            addMinus1PointPerBlackNoble: addMinus1PointPerBlackNoble,
            addPointsForCountAndCountess: addPointsForCountAndCountess
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
                activeActionCards: []
            };
        }

        function computePoints(playerInstance) {
            player = playerInstance;
            player.points = 0;

            player.nobleCards.forEach(function (card) {
                callAction(card);
            });

            player.activeActionCards.forEach(function (card) {
                callAction(card);
            });

            player.actionCards.forEach(function (card) {
                callAction(card);
            });

            sumCardPoints();
        }

        function sumCardPoints() {
            player.nobleCards.forEach(function (card) {
                player.points += card.computedPoints || card.points;
            });

            player.activeActionCards.forEach(function (card) {
                player.points += card.computedPoints || card.points || 0;
            });
        }

        function callAction(card) {
            if (angular.isDefined(actions[card.action])) {
                card.computedPoints = actions[card.action]();
            }
        }

        function computePointsPerNoble(points, cardColor) {
            return player.nobleCards.filter(function (card) {
                return card.color === cardColor;
            }).length * points;
        }

        function add1PointPerRedNoble() {
            return computePointsPerNoble(1, 'red');
        }

        function add1PointPerBlueNoble() {
            return computePointsPerNoble(1, 'blue');
        }

        function add1PointPerGreenNoble() {
            return computePointsPerNoble(1, 'green');
        }

        function add1PointPerVioletNoble() {
            return computePointsPerNoble(1, 'violet');
        }

        function addMinus1PointPerBlackNoble() {
            return computePointsPerNoble(-1, 'black');
        }

        function setBlackNoblePointsTo1() {
            return player.nobleCards.reduce(function (sum, card) {
                return card.color === 'black' ? sum - (card.computedPoints || card.points) + 1 : sum;
            }, 0);
        }

        function addPointsForGuards() {
            return player.nobleCards.filter(function (card) {
                return card.action === 'addPointsForGuards';
            }).length;
        }

        function addPointsForCountAndCountess() {
            return player.nobleCards.filter(function(card) {
                return card.action === 'addPointsForCountAndCountess';
            }).length * 2;
        }
    }

    return PlayerService;
});
