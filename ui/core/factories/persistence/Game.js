define([], function() {
    'use strict';

    function Game($mongoLabResource) {
        return $mongoLabResource('game');
    };

    return Game;
});