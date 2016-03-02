define([], function() {
    'use strict';

    function CardService() {
        return {
            mix: mix,
            draw: draw
        };

        function mix(cards) {
            var random = cards.map(Math.random);

            cards.sort(function(cardLeft, cardRight) {
              return random[cardLeft.id] - random[cardRight.id];
            });
        }

        function draw(stack, count) {
            return (count > 0)
                ? stack.splice(0, count)
                : [];
        }
    }

    return CardService;
});