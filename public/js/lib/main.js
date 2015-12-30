import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-animate';
import bootstrapSocketChannel from './socket/channel';
import PollDirective from './poll/directive.poll';
import Roller from './poll/directive.roller';
import VotePollCtrl from './poll/ctrl.vote';
import PollCtrl from './poll/ctrl.poll';
import StepCtrl from './poll/ctrl.step';
import 'restangular';
import setComponents from './di';

angular
    .module('app.main', ['ngSanitize', 'ui.router', 'restangular', 'ngAnimate'])
    .directive('poll', () => new PollDirective())
    .directive('roller', () => new Roller())
    .controller('votePollCtrl', VotePollCtrl)
	.controller('stepCtrl', StepCtrl)
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
            .state('pollStep', {
                url: '/poll/:id/:step',
	            templateUrl: 'partials/vote-step.html',
	            controller: 'stepCtrl as step'
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