import angular from 'angular';
import angularSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import bootstrapSocketChannel from './socket/channel';
import PollDirective from './poll/directive.poll';
import VotePollCtrl from './poll/ctrl.poll';
import Restangular from 'restangular';
import setComponents from './di';

angular
    .module('app.main', ['ngSanitize', 'ui.router', 'restangular'])
    .directive('poll', () => new PollDirective())
    .controller('votePollCtrl', VotePollCtrl)
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
        ($stateProvider, $locationProvider,$urlRouterProvider) => {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('poll', {
                url: '/poll/:id',
                templateUrl: 'partials/vote-result.html'
            })
            .state('vote', {
                url: '/vote/:id',
                templateUrl: 'partials/vote.html'
            });

        $urlRouterProvider.when('/','/poll/ksw33');
    }])
    .run((Restangular, $stateParams, $state) => {
        setComponents({
            restangular: Restangular,
            stateParams: $stateParams,
            state: $state
        });

        console.info('app run');
    });

angular
    .element(document)
    .ready(() => {
        bootstrapSocketChannel();
        angular.bootstrap(document, ['app.main']);
    });