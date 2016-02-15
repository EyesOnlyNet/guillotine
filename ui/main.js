require.config({
  paths: {
      'angular' : '../node_modules/angular/angular',
      'angularUiRouter' : '../node_modules/angular-ui-router/release/angular-ui-router',
      'MongoLabResourceFactory' : 'core/factories/persistence/MongoLabResourceFactory'
  },
  shim: {
      MongoLabResourceFactory: {
          deps: ['angular'],
          exports: 'angular'
      },
      angularUiRouter: {
          deps: ['angular'],
          exports: 'angular'
      },
      angular: {
          exports : 'angular'
      }
  },
  baseUrl: '/ui'
});

require(['app'], function (app) {
    app.init();
});
