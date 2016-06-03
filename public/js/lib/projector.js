import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-animate';
import {PollDirective, BestTeamPollDirective} from './poll/directive.poll';
import {SimplePollDirective, DemoPollDirective, ZuzelTorunPollDirective} from './poll/directive.simplePoll';
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

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

angular
    .module('app.projector', ['ngSanitize', 'ui.router', 'restangular', 'ngAnimate', 'templates'])
    .directive('zuzelPoll', () => new ZuzelTorunPollDirective())
	.directive('simplePoll', () => new SimplePollDirective())
    .directive('bestTeamPoll', () => new BestTeamPollDirective())
    .directive('demoPoll', () => new DemoPollDirective())
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
                template: '<div ui-view></div>',
                abstract: true,
                url: '/:parent/:pollName?stay'
            })
            .state('poll.default', {
                templateUrl: 'partials/vote-step.html',
                controller: 'stepCtrl as step',
                url: ''
            })
            .state('poll.step', {
                templateUrl: 'partials/vote-step.html',
                controller: 'stepCtrl as step',
                url: '/:step'
            });
    }])
    .run((Restangular, $stateParams, $state, $timeout, $rootScope) => {
        setComponents({
            restangular: Restangular,
            stateParams: $stateParams,
            state: $state,
	        timeout: $timeout
        });

        if(inIframe()) {
            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams) {
                    var href = $state.href(toState.name, toParams);

                    history.replaceState(null, null, href);
                });
        }
    });

angular
    .element(document)
    .ready(() => angular.bootstrap(document, ['app.projector']));