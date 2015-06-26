/* global angular, Queue, NobleCard, ActionCard */

var appSvcs = angular.module('services', []);

appSvcs.factory('dbSvc', ['$http', function($http) {
    var baseUrl = 'https://api.mongolab.com/api/1',
        database = '/databases/guillotine',
        collection = '/collections/games',
        apiKey = '?apiKey=50773553e4b03a45bd2f336b',
        connectionUrl = baseUrl + database + collection + apiKey;

    return {
        createGame: function(game, successFunction) {
            var url = connectionUrl;

            console.log(game);
            $http.post(url, game).success(successFunction);
        },
        readGame: function(query, successFunction) {
            var url = connectionUrl + '&q=' + angular.toJson(query || {}) + '&fo=true';

            $http.get(url).success(successFunction);
        },
        updateGame: function(query, successFunction) {
            var url = connectionUrl + '&q=' + angular.toJson(query || {});

            console.log(game);
            game = $http.put(url, game).success(successFunction);;
        }
    };
}]);

appSvcs.factory('uuidSvc', function() {
    return {
        create: function() {
            return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
        }
    };
});

appSvcs.factory('playerSvc', function(uuidSvc) {
    return {
        /**
         * berechnen der Punktzahl
         */
        computePoints: function(player) {
            var points = 0;

            for (var i in player.nobleCards) {
                if (!isNaN(player.nobleCards[i].points)) {
                    points += player.nobleCards[i].points;
                }
            }

            return points;
        },

        init: function (player) {
            player.pid = uuidSvc.create();
        }
    };
});

appSvcs.factory('gameSvc', ['$rootScope', function($rootScope, uuidSvc) {
    var actionCardsLimitPerPlayer = 5,
        initialQueueLength = 12;

    return {
        /**
         * Actionkarten-Stapel befüllen
         */
        fillActionCardStack: function() {
            $rootScope.game.actionCardStack = ActionCard.cards;
        },

        /**
         * Adelskarten-Stapel befüllen
         */
        fillNobleCardStack: function() {
            $rootScope.game.nobleCardStack = NobleCard.cards;
        },

        /**
         * Alle Karten mischen
         */
        mixAllCards: function() {
            this.mixActionCardStack();
            this.mixNobleCardStack();
        },

        /**
         * Actionkarten-Stapel mischen
         */
        mixActionCardStack: function() {
            var game = $rootScope.game;

            if (game.actionCardStack.length === 0) {
                this.fillActionCardStack();
            }

            game.actionCardStack = this.mixCards(game.actionCardStack);
        },

        /**
         * Adelskarten-Stapel mischen
         */
        mixNobleCardStack: function() {
            var game = $rootScope.game;

            if (game.nobleCardStack.length === 0) {
                this.fillNobleCardStack();
            }

            game.nobleCardStack = this.mixCards(game.nobleCardStack);
        },

        /**
         * mischt die übergebenen Karten und gibt diese zurück
         */
        mixCards: function(cards) {
            var length = cards.length,
                iterations = length * 3;

            for (var i = 0; i < iterations; i++) {
                var position   = Math.round((Math.random() * iterations)) % length,
                    randomCard = cards[position];

                cards.splice(position, 1);
                cards.push(randomCard);
            }

            return cards;
        },

        /**
         * Auffüllen der Warteschlange
         *
         * @param count - auf wieviel die Warteschlange aufgefüllt werden soll
         */
        fillQueue: function(count) {
            var game = $rootScope.game;

            if (game.queue === null) {
                game.queue = new Queue();
            }

            count -= game.queue.cards.length;
            game.queue.cards = game.queue.cards.concat(this.drawNobleCards(count));
        },

        /**
         * Karte(n) vom Actionkarten-Stapel ziehen
         *
         * @param count - wieviel Karten gezogen werden sollen
         */
        drawActionCards: function(count) {
            var cards = [];

            if (count > 0) {
                cards = $rootScope.game.actionCardStack.splice(0, count);
            }

            return cards;
        },

        /**
         * Karte(n) vom Adelskarten-Stapel ziehen
         *
         * @param count - wieviel Karten gezogen werden sollen
         */
        drawNobleCards: function(count) {
            var cards = [];

            if (count > 0) {
                cards = $rootScope.game.nobleCardStack.splice(0, count);
            }

            return cards;
        },

        /**
         * Verteilen der Karten an die Spieler
         */
        preparePlayers: function() {
            var game = $rootScope.game;

            for (var i = 0; i < actionCardsLimitPerPlayer; i++) {
                for (var k in game.playerList) {
                    if (game.playerList[k].count >= actionCardsLimitPerPlayer) {
                        continue;
                    }

                    game.playerList[k].actionCards.concat(this.drawActionCards(1));
                }
            }
        },

        /**
         * Ändern der Richtung der Warteschlange
         */
        changeQueueDirection: function() {
            var game = $rootScope.game;

            game.queue.cards = game.queue.cards.reverse();
        },

        /**
         * den ersten Adligen der Reihe köpfen
         */
        behead: function() {
            var game = $rootScope.game;

            game.beheadedCards.push(game.queue.cards.shift());
        },

        /**
         * Übertragen der geköpften Karten an den aktiven Spieler
         */
        activePlayerDrawBeheadedCards: function() {
            var game = $rootScope.game;

            game.activePlayer.nobleCards = game.activePlayer.nobleCards.concat(game.beheadedCards);
            game.activePlayer.computePoints();   /* todo: with PlayerSvc*/

            game.beheadedCards = [];
        },

        /**
         * ziehen einer Aktionskarte
         */
        activePlayerDrawActionCard: function() {
            var game = $rootScope.game;

            game.activePlayer.actionCards = game.activePlayer.actionCards.concat(this.drawActionCards(1));
        },

        /**
         * erzeugt einen unique identifier
         */
        createUid: function() {
            $rootScope.game.gid = uuidSvc.create();
        },

        init: function () {
            this.createUid();
            this.fillActionCardStack();
            this.fillNobleCardStack();
            this.mixAllCards();
            this.fillQueue(initialQueueLength);
            this.preparePlayers();
        }
    };
}]);
