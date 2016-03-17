define(function (require) {
    'use strict';

    require('angularUiRouter');
    require('MongoLabResourceFactory');

    var angular = require('angular');
    var app = angular.module('guillotine', [
        'ui.router',
        'mongoLabResource'
    ]);

    app.factory('GameResource', require('core/resource/GameResource'));
    app.factory('UuidService', require('core/service/UuidService'));
    app.factory('PlayerService', require('core/service/PlayerService'));
    app.factory('CardService', require('core/service/CardService'));
    app.factory('GameService', require('core/service/GameService'));
    app.factory('StorageService', require('core/service/StorageService'));

    app.constant('MONGOLAB_CONFIG', {
        API_KEY:'50773553e4b03a45bd2f336b',
        DB_NAME:'guillotine'
    });
    app.constant('GAME_CONFIG', {
        actionCardsPerPlayer: 15,
        queueLength: 6,
        days: 2,
        actionCards: require('json!core/data/actionCards.json'),
        nobleCards: require('json!core/data/nobleCards.json')
    });

    app.controller('RegisterController', require('register/RegisterController'));
    app.controller('LoginController', require('login/LoginController'));
    app.controller('PlaygroundController', require('playground/PlaygroundController'));

    app.config(function ($locationProvider, $urlRouterProvider, $stateProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider.otherwise('/hang-in');

        $stateProvider.state(
            'hangIn', {
                url: '/hang-in',
                templateUrl: '/ui/register/register.html',
                controller: 'RegisterController as regVm'
            }
        ).state(
            'hangOn', {
                url: '/hang-on',
                templateUrl: '/ui/login/login.html',
                controller: 'LoginController as logVm'
            }
        ).state(
            'playground', {
                url: '/playground',
                templateUrl: '/ui/playground/playground.html',
                controller: 'PlaygroundController as playVm'
            }
        ).state(
            'end', {
                url: '/end',
                templateUrl: '/ui/result/result.html',
                controller: 'ResultController as resVm'
            }
        );
    });

    app.run(['$rootScope', '$state', 'StorageService', function($rootScope, $state, StorageService) {
        $rootScope.$on('$stateChangeStart', function(evt, to) {
            if (to.name === 'hangOn') {
                return;
            }

            if (StorageService.getGame() === void 0) {
                evt.preventDefault();
                $state.go('hangOn');
            }
        });
    }]);

    app.init = function () {
        angular.bootstrap(document, ['guillotine']);
    };

    return app;
});
