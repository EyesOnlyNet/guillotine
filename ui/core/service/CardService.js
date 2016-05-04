define([], function() {
    'use strict';

    function CardService() {
        return {
            mix: mix,
            draw: draw
        };

        function mix(cards) {
            var mixedCards = [];

            while (cards.length) {
                var indexCards = Math.floor(Math.random() * cards.length);
                var indexMixedCards = Math.floor(Math.random() * mixedCards.length);

                mixedCards.splice(indexMixedCards, 0, cards.splice(indexCards, 1).pop());
            }

            mixedCards.forEach(function(card) {
                cards.push(card);
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