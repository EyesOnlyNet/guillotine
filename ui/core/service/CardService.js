define([], function() {
    'use strict';

    function CardService() {
        return {
            mix: mix,
            draw: draw
        };

        function mix(cards) {
            cards.sort(function() {
                return 0.5 - Math.random();
            });
        }

        function draw(stack, count) {
            return (count > 0 && stack.length > 0)
                ? stack.splice(0, count)
                : [];
        }
    }

    return CardService;
});