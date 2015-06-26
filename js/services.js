/* global angular */

var appSvcs = angular.module('services', []);

appSvcs.factory('db', ['$http', function($http) {
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

            $http.get(url).success(successFunction);;
        },
        updateGame: function(query, successFunction) {
            var url = connectionUrl + '&q=' + angular.toJson(query || {});

            console.log(game);
            game = $http.put(url, game).success(successFunction);;
        }
    };
}]);
