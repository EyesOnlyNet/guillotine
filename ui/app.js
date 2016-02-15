define(function (require) {
    'use strict';

    require('angularUiRouter');
    require('MongoLabResourceFactory');

    var angular = require('angular'),
        app = angular.module('guillotine', [
            'ui.router',
            'mongoLabResource'
        ]);

    app.constant('MONGOLAB_CONFIG', {API_KEY:'50773553e4b03a45bd2f336b', DB_NAME:'guillotine'});

    app.controller('RegisterController', require('register/RegisterController'));

    app.factory('PlayerService', require('core/factories/PlayerService'));
    app.factory('Game', require('core/factories/persistence/Game'));

    app.config(function ($locationProvider, $urlRouterProvider, $stateProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider.otherwise('/');

        $stateProvider.state(
            'start', {
                url: '/',
                templateUrl: '/ui/register/register.html',
                controller: 'RegisterController as regVm'
            }
        );
    });

    app.init = function () {
        angular.bootstrap(document, ['guillotine']);
    };

    return app;
});
