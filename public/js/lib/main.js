import angular from 'angular';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

angular
    .module('app.main', ['ngSanitize', 'ui.router'])
    .run(() => {
    console.info('app run');
});

angular
    .element(document)
    .ready(() => {
    angular.bootstrap(document, ['app.main']);
});