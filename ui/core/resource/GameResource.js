define([], function() {
    'use strict';

    function GameResource($mongoLabResource) {
        return $mongoLabResource('game');
    };

    return GameResource;
});