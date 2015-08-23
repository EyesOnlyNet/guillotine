/* global angular, NobleCard, ActionCard */

(function() {
    var appSvcs = angular.module('services', []);

    appSvcs.factory('dbSvc', ['$http', function($http) {
        var baseUrl = 'https://api.mongolab.com/api/1',
            database = '/databases/guillotine',
            collection = '/collections/games',
            apiKey = '?apiKey=50773553e4b03a45bd2f336b',
            connectionUrl = baseUrl + database + collection + apiKey;

        return {
            readGame: function(query, successFunction) {
                var url = connectionUrl + '&q=' + angular.toJson(query) + '&fo=true';

                $http.get(url).success(successFunction || function() {});
            },
            upsertGame: function(game, successFunction) {
                var url = connectionUrl + '&u=true&q=' + angular.toJson({gid: game.gid});

                $http.put(url, game).success(successFunction || function() {});
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

    appSvcs.factory('playerSvc', function($rootScope, uuidSvc) {
        return {
            create: function(name) {
                var player = new Player(name);

                player.pid = uuidSvc.create();

                return player;
            },

            computePoints: function(player) {
                var points = 0;

                for (var i in player.nobleCards) {
                    if (!isNaN(player.nobleCards[i].points)) {
                        points += player.nobleCards[i].points;
                    }
                }

                player.points = points;

                return player;
            },

            getIndexOfPlayerInPlayerList: function(pid) {
                return $rootScope.game.playerList.map(function(player) {
                    return player.pid;
                }).indexOf(pid);
            }
        };
    });

    appSvcs.factory('meSvc', function($rootScope, playerSvc) {
        return {
            create: function(pid) {
                var me = new Me(pid);

                me.playerListIndex = playerSvc.getIndexOfPlayerInPlayerList(pid);
                $rootScope.me = me;
            }
        };
    });

    appSvcs.factory('gameSvc', function($rootScope, $routeParams, uuidSvc, playerSvc, meSvc, dbSvc) {
        var actionCardsLimitPerPlayer = 5,
            initialQueueLength = 12,
            daysPerPlay = 3;

        return {
            init: function() {
                var gid = $routeParams.gid,
                    pid = $routeParams.pid;

                if (gid) {
                    this.loadByGid(gid);
                } else if (pid) {
                    this.loadByPid(pid);
                } else {
                    this.create();
                }
            },

            create: function() {
                var game = new Game();

                game.gid = uuidSvc.create();

                $rootScope.game = game;
            },

            store: function(onSuccess) {
                dbSvc.upsertGame($rootScope.game, onSuccess);
            },

            load: function(query, onSuccess) {
                dbSvc.readGame(query, function(game) {
                    $rootScope.game = game;

                    if (onSuccess) {
                        onSuccess();
                    }
                });
            },

            loadByGid: function(gid) {
                this.load({'gid': gid});
            },

            loadByPid: function(pid) {
                this.load({'playerList.pid': pid}, function() {
                    meSvc.create(pid);
                });
            },

            refresh: function() {
                this.loadByGid($rootScope.game && $rootScope.game.gid);
            },

            getGid: function() {
                return $rootScope.game.gid;
            },

            addPlayer: function(player) {
                var game = $rootScope.game;

                game.playerList.push(player);
                game.activePid = game.activePid || player.pid;
            },

            meIsActivePlayer: function() {
                return $rootScope.game && $rootScope.me && $rootScope.game.activePid === $rootScope.me.pid;
            },

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

                count -= game.queue.length;
                game.queue = game.queue.concat(this.drawNobleCards(count));
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
            preparePlayersWithCards: function() {
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
                $rootScope.game.queue.reverse();
            },

            /**
             * den ersten Adligen der Reihe köpfen
             */
            behead: function() {
                var game = $rootScope.game,
                    index = $rootScope.me.playerListIndex,
                    player = game.playerList[index];

                player.nobleCards.push(game.queue.shift());

                this.computePoints();
                this.nextPlayer();

                if(this.endReached()) {
                    this.end();
                } else {
                    this.nextDay();
                }
            },

            computePoints: function() {
                var game = $rootScope.game;

                game.playerList.forEach(function(player, index) {
                    game.playerList[index] = playerSvc.computePoints(player);
                });
           },

            /**
             * ziehen einer Aktionskarte
             */
            drawActionCard: function() {
                $rootScope.game.playerList[$rootScope.me.playerListIndex].actionCards.concat(this.drawActionCards(1));
            },

            nextPlayer: function() {
                var game = $rootScope.game,
                    index = playerSvc.getIndexOfPlayerInPlayerList(game.activePid) + 1;

                game.activePid = game.playerList[index % game.playerList.length].pid;

                dbSvc.upsertGame(game);
            },

            nextDay: function() {
                var game = $rootScope.game;

                if (game.queue.length === 0) {
                    game.day++;
                    this.fillQueue(initialQueueLength);
                }
            },

            endReached: function() {
                var game = $rootScope.game;

                return game.queue.length <= 0 && game.day >= daysPerPlay;
            },

            start: function () {
                this.fillActionCardStack();
                this.fillNobleCardStack();
                this.mixAllCards();
                this.fillQueue(initialQueueLength);
                this.preparePlayersWithCards();

                $rootScope.game.day = 1;

                dbSvc.upsertGame($rootScope.game);
            },

            end: function() {
                $rootScope.game.activePid = '';
            }
        };
    });
})();
