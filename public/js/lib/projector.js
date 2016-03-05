import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-animate';
import PollDirective from './poll/directive.poll';
import Roller from './poll/directive.roller';
import PollCtrl from './poll/ctrl.poll';
import StepCtrl from './poll/ctrl.step';
import ParticipantsCtrl from './poll/ctrl.participants';
import VoteResultCtrl from './poll/ctrl.voteResult';
import 'restangular';
import setComponents from './di';
import PollClassDirective from './poll/directive.pollClass';
import './templates';

angular
    .module('app.projector', ['ngSanitize', 'ui.router', 'restangular', 'ngAnimate', 'templates'])
    .directive('poll', () => new PollDirective())
    .directive('roller', () => new Roller())
	.directive('pollClass', () => new PollClassDirective())
	.controller('stepCtrl', StepCtrl)
    .controller('pollCtrl', PollCtrl)
    .controller('participantsCtrl', ParticipantsCtrl)
	.controller('voteResultCtrl', VoteResultCtrl)
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
        ($stateProvider, $locationProvider) => {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('poll', {
                url: '/projector/poll/:id',
                controller: 'pollCtrl as poll',
                templateUrl: 'partials/vote-result.html'
            })
            .state('pollStep', {
                url: '/projector/:parent/:pollName/:step?stay',
	            templateUrl: 'partials/vote-step.html',
	            controller: 'stepCtrl as step'
            });
    }])
    .run((Restangular, $stateParams, $state, $timeout) => {
        setComponents({
            restangular: Restangular,
            stateParams: $stateParams,
            state: $state,
	        timeout: $timeout
        });
    });

angular
    .element(document)
    .ready(() => angular.bootstrap(document, ['app.projector']));