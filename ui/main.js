require.config({
  paths: {
      angular: '../node_modules/angular/angular',
      angularUiRouter: '../node_modules/angular-ui-router/release/angular-ui-router',
      MongoLabResourceFactory: 'core/factory/MongoLabResourceFactory',
      text: '../node_modules/requirejs-plugins/lib/text',
      json: '../node_modules/requirejs-plugins/src/json'
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
