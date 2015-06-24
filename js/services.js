/* global angular */

var appSvcs = angular.module('services', []);

var baseUrl = 'https://api.mongolab.com/api/1',
    database = '/databases/guillotine',
    collection = '/collections/games',
    apiKey = '?apiKey=50773553e4b03a45bd2f336b',
    connectionUrl = baseUrl + database + collection + apiKey;

appSvcs.factory('db', ['$http', function($http) {
    return {
        createGame: function(game) {
            var url = connectionUrl;

            console.log(game);
            $http.post(url, game);
        },
        readGame: function(gid) {
            var url = connectionUrl + '&q={"gid": "' + gid + '"}&fo=true';

            $http.get(url);
        },
        updateGame: function(game) {
            var url = connectionUrl + '&q={"gid": "' + game.gid + '"}';

            console.log(game);
            game = $http.put(url, game);
        }
    };
}]);
