define([], function () {
    'use strict';

    function PlayerService(UuidService) {
        var player = {};
        var actions = {
            add2Points: add2Points,
            add1PointPerRedNoble: add1PointPerRedNoble,
            add1PointPerBlueNoble: add1PointPerBlueNoble,
            add1PointPerGreenNoble: add1PointPerGreenNoble,
            add1PointPerVioletNoble: add1PointPerVioletNoble,
            setBlackNoblePointsTo1: setBlackNoblePointsTo1,
            sub2Points: sub2Points,
            addPointsForGuards: addPointsForGuards,
            addPointsForTragicNoble: addPointsForTragicNoble,
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

            sumCardPoints();

            player.nobleCards.forEach(function (card) {
                callAction(card.action);
            });

            player.activeActionCards.forEach(function (card) {
                callAction(card.action);
            });
        }

        function sumCardPoints() {
            player.nobleCards.forEach(function (card) {
                player.points += card.points;
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

        function sub2Points() {
            player.points -= 2;
        }

        function addPointsPerNoble(points, cardColor) {
            player.nobleCards.forEach(function (card) {
                if (card.color === cardColor) {
                    player.points += points;
                }
            });
        }

        function add1PointPerRedNoble() {
            addPointsPerNoble(1, 'red');
        }

        function add1PointPerBlueNoble() {
            addPointsPerNoble(1, 'blue');
        }

        function add1PointPerGreenNoble() {
            addPointsPerNoble(1, 'green');
        }

        function add1PointPerVioletNoble() {
            addPointsPerNoble(1, 'violet');
        }

        function setBlackNoblePointsTo1() {
            player.nobleCards.forEach(function (card) {
                if (card.color === 'black') {
                    player.points += (card.points * -1) + 1;
                }
            });
        }

        function addPointsForGuards() {
            player.nobleCards.forEach(function (card) {
                if (card.action === 'addPointsForGuards') {
                    player.points += 1;
                }
            });
        }

        function addPointsForTragicNoble() {
            player.nobleCards.forEach(function (card) {
                if (card.color === 'black') {
                    player.points -= 1;
                }
            });
        }

        function addPointsForCountAndCountess() {
            var filteredCards = player.nobleCards.filter(function(card) {
                return card.action === 'addPointsForCountAndCountess';
            });

            var hasCountAndCountess = filteredCards.length === 2;

            if (hasCountAndCountess) {
                player.points += 2;
            }
        }
    }

    return PlayerService;
});