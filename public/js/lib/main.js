import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';
import bootstrapSocketChannel from './socket/channel';
import PollDirective from './poll/directive.poll';
import Roller from './poll/directive.roller';
import VotePollCtrl from './poll/ctrl.vote';
import PollCtrl from './poll/ctrl.poll';
import 'restangular';
import setComponents from './di';

angular
    .module('app.main', ['ngSanitize', 'ui.router', 'restangular'])
    .directive('poll', () => new PollDirective())
    .directive('roller', () => new Roller())
    .controller('votePollCtrl', VotePollCtrl)
    .controller('pollCtrl', PollCtrl)
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
        ($stateProvider, $locationProvider,$urlRouterProvider) => {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('poll', {
                url: '/poll/:id',
                controller: 'pollCtrl as poll',
                templateUrl: 'partials/vote-result.html'
            })
            .state('vote', {
                url: '/vote/:id',
                controller: 'pollCtrl as poll',
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