(function() {
    'use strict';

    angular.module('app.services', [])
        .factory('MeSvc', MeSvc)
        .factory('GameSvc', GameSvc)
        .factory('DbSvc', DbSvc)
        .factory('UuidSvc', UuidSvc)
        .factory('PlayerSvc', PlayerSvc);

    function DbSvc($http) {
        var baseUrl = 'https://api.mongolab.com/api/1',
            database = '/databases/guillotine',
            collection = '/collections/games',
            apiKey = '?apiKey=50773553e4b03a45bd2f336b',
            connectionUrl = baseUrl + database + collection + apiKey;

        return {
            readGame: readGame,
            upsertGame: upsertGame
        };

        function readGame(query, successFunction) {
            var url = connectionUrl + '&q=' + angular.toJson(query) + '&fo=true';

            $http.get(url).success(successFunction || function() {});
        }

        function upsertGame(game, successFunction) {
            var url = connectionUrl + '&u=true&q=' + angular.toJson({gid: game.gid});

            $http.put(url, game).success(successFunction || function() {});
        }
    };

    function UuidSvc() {
        return {
            create: create
        };

        function create() {
            return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
        }
    }

    function PlayerSvc($rootScope, UuidSvc) {
        return {
            create: create,
            computePoints: computePoints,
            getIndexOfPlayerInPlayerList: getIndexOfPlayerInPlayerList
        };

        function create(name) {
            var player = new Player(name);

            player.pid = UuidSvc.create();

            return player;
        }

        function computePoints(player) {
            var points = 0;

            for (var i in player.nobleCards) {
                if (!isNaN(player.nobleCards[i].points)) {
                    points += player.nobleCards[i].points;
                }
            }

            player.points = points;

            return player;
        }

        function getIndexOfPlayerInPlayerList(pid) {
            return $rootScope.game.playerList.map(function(player) {
                return player.pid;
            }).indexOf(pid);
        }
    };

    function MeSvc($rootScope, PlayerSvc) {
        return {
            get: get,
            create: create
        };

        function create(pid) {
            var me = new Me(pid);

            me.playerListIndex = PlayerSvc.getIndexOfPlayerInPlayerList(pid);
            $rootScope.me = me;
        };

        function get() {
            return $rootScope.me;
        };
    };

    function GameSvc($rootScope, $routeParams, UuidSvc, PlayerSvc, MeSvc, DbSvc) {
        var actionCardsLimitPerPlayer = 5,
            initialQueueLength = 12,
            daysPerPlay = 3;

        return {
            init: init,
            addPlayer: addPlayer,
            store: store,
            start: start,
            behead: behead,
            get: get,
            meIsActivePlayer: meIsActivePlayer,
            endReached: endReached
        };

        function store(onSuccess) {
            DbSvc.upsertGame($rootScope.game, onSuccess);
        };

        function load(query, onSuccess) {
            DbSvc.readGame(query, function(game) {
                $rootScope.game = game;

                if (onSuccess) {
                    onSuccess();
                }
            });
        };

        function get() {
            var me = MeSvc.get();

            if (me) {
                return loadByPid(me.pid);
            }
        };

        function loadByGid(gid) {
            load({'gid': gid});
        };

        function loadByPid(pid) {
            load({'playerList.pid': pid}, function() {
                MeSvc.create(pid);
            });
        };

        function refresh() {
            loadByGid($rootScope.game && $rootScope.game.gid);
        };

        function getGid() {
            return $rootScope.game.gid;
        };

        function addPlayer(player) {
            var game = $rootScope.game;

            game.playerList.push(player);
            game.activePid = game.activePid || player.pid;
        };

        function meIsActivePlayer() {
            return $rootScope.game && $rootScope.me && $rootScope.game.activePid === $rootScope.me.pid;
        };

        function fillActionCardStack() {
            $rootScope.game.actionCardStack = ActionCard.cards;
        };

        function fillNobleCardStack() {
            $rootScope.game.nobleCardStack = NobleCard.cards;
        };

        function mixAllCards() {
            mixActionCardStack();
            mixNobleCardStack();
        };

        function mixActionCardStack() {
            var game = $rootScope.game;

            if (game.actionCardStack.length === 0) {
                fillActionCardStack();
            }

            game.actionCardStack = mixCards(game.actionCardStack);
        };

        function mixNobleCardStack() {
            var game = $rootScope.game;

            if (game.nobleCardStack.length === 0) {
                fillNobleCardStack();
            }

            game.nobleCardStack = mixCards(game.nobleCardStack);
        };

        function mixCards(cards) {
            var length = cards.length,
                iterations = length * 3;

            for (var i = 0; i < iterations; i++) {
                var position   = Math.round((Math.random() * iterations)) % length,
                    randomCard = cards[position];

                cards.splice(position, 1);
                cards.push(randomCard);
            }

            return cards;
        };

        function fillQueue(count) {
            var game = $rootScope.game;

            count -= game.queue.length;
            game.queue = game.queue.concat(drawNobleCards(count));
        };

        function drawActionCards(count) {
            var cards = [];

            if (count > 0) {
                cards = $rootScope.game.actionCardStack.splice(0, count);
            }

            return cards;
        };

        function drawNobleCards(count) {
            var cards = [];

            if (count > 0) {
                cards = $rootScope.game.nobleCardStack.splice(0, count);
            }

            return cards;
        };

        function preparePlayersWithCards() {
            var game = $rootScope.game;

            for (var i = 0; i < actionCardsLimitPerPlayer; i++) {
                for (var k in game.playerList) {
                    if (game.playerList[k].count >= actionCardsLimitPerPlayer) {
                        continue;
                    }

                    game.playerList[k].actionCards.concat(drawActionCards(1));
                }
            }
        };

        function changeQueueDirection() {
            $rootScope.game.queue.reverse();
        };

        function behead() {
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
        };

        function computePoints() {
            var game = $rootScope.game;

            game.playerList.forEach(function(player, index) {
                game.playerList[index] = PlayerSvc.computePoints(player);
            });
       };

        function drawActionCard() {
            $rootScope.game.playerList[$rootScope.me.playerListIndex].actionCards.concat(drawActionCards(1));
        };

        function nextPlayer() {
            var game = $rootScope.game,
                index = PlayerSvc.getIndexOfPlayerInPlayerList(game.activePid) + 1;

            game.activePid = game.playerList[index % game.playerList.length].pid;

            DbSvc.upsertGame(game);
        };

        function nextDay() {
            var game = $rootScope.game;

            if (game.queue.length === 0) {
                game.day++;
                fillQueue(initialQueueLength);
            }
        };

        function endReached() {
            var game = get();

            if (game) {
                return game.queue.length <= 0 && game.day >= daysPerPlay;
            }
        };

        function start() {
            fillActionCardStack();
            fillNobleCardStack();
            mixAllCards();
            fillQueue(initialQueueLength);
            preparePlayersWithCards();

            $rootScope.game.day = 1;

            DbSvc.upsertGame($rootScope.game);
        };

        function end() {
            $rootScope.game.activePid = '';
        };

        function init() {
            var gid = $routeParams.gid,
                pid = $routeParams.pid;

            if (gid) {
                loadByGid(gid);
            } else if (pid) {
                loadByPid(pid);
            } else {
                create();
            }
        };

        function create() {
            var game = new Game();

            game.gid = UuidSvc.create();

            $rootScope.game = game;
        }
    };
})();
