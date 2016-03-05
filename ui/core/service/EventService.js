define([], function() {
    'use strict';

    var actions = {
        add2Points: add2Points,
        add1PointPerRedNoble: add1PointPerRedNoble,
        add1PointPerBlueNoble: add1PointPerBlueNoble,
        add1PointPerGreenNoble: add1PointPerGreenNoble,
        add1PointPerVioletNoble: add1PointPerVioletNoble,
        setBlackNoblePointsTo1: setBlackNoblePointsTo1
    };

    function EventService() {
        return {
            send: send,
            apply: apply
        };
    }

    function apply(player, card) {
        actions[card.action](player);
    }

    function send(step, player) {
        player.activeActionCards.forEach(function(card) {
            if (card.step === step) {
                apply(player, card);
            }
        });
    }

    function add2Points(player) {
        player.points += 2;
    }

    function adPointsPerNoble(player, cardColor) {
        player.points += player.nobleCards.filter(function(card) {
            return card.color === cardColor;
        }).length;

    }

    function add1PointPerRedNoble(player) {
        adPointsPerNoble(player, 'red');
    }

    function add1PointPerBlueNoble(player) {
        adPointsPerNoble(player, 'blue');
    }

    function add1PointPerGreenNoble(player) {
        adPointsPerNoble(player, 'green');
    }

    function add1PointPerVioletNoble(player) {
        adPointsPerNoble(player, 'violet');
    }

    function setBlackNoblePointsTo1(player) {
        player.nobleCards.forEach(function(card) {
            if(card.color === 'black') {
                player.points += (card.points * -1) + 1;
            }
        });
    }

    return EventService;
});