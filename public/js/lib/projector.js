import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-animate';
import {BestTeamPollDirective, PollDirective} from './poll/directive.poll';
import Roller from './poll/directive.roller';
import PollCtrl from './poll/ctrl.poll';
import StepCtrl from './poll/ctrl.step';
import ParticipantsCtrl from './poll/ctrl.participants';
import VoteResultCtrl from './poll/ctrl.voteResult';
import 'restangular';
import setComponents from './di';
import PollClassDirective from './poll/directive.pollClass';
import './templates';
import TychyTopBanner from './UI/tychyTopBanner';

angular
    .module('app.projector', ['ngSanitize', 'ui.router', 'restangular', 'ngAnimate', 'templates'])
	.directive('bestTeamPoll', () => new BestTeamPollDirective())
    .directive('poll', () => new PollDirective())
    .directive('roller', () => new Roller())
	.directive('pollClass', () => new PollClassDirective())
    .directive('tychyTopBanner', () => new TychyTopBanner())
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
            .state('pollName', {
                templateUrl: 'partials/vote-step.html',
                controller: 'stepCtrl as step',
                url: '/projector/:parent/:pollName?stay'
            })
            .state('pollNameStep', {
                templateUrl: 'partials/vote-step.html',
                controller: 'stepCtrl as step',
                url: '/projector/:parent/:pollName/:step?stay'
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