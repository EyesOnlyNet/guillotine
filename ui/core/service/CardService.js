define([], function() {
    'use strict';

    function CardService() {
        return {
            mix: mix
        };

        function mix(cards) {
            for (var i = 0; i < cards.length; i++) {
                var position = Math.round(Math.random()) % cards.length,
                    randomCard = cards[position];

                cards.splice(position, 1);
                cards.push(randomCard);
            }

            return cards;
        }
    }

    return CardService;
});