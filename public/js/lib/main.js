import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-animate';
import bootstrapSocketChannel from './socket/channel';
import Roller from './poll/directive.roller';
import VotePollCtrl from './poll/ctrl.vote';
import PollCtrl from './poll/ctrl.poll';
import 'restangular';
import setComponents from './di';

angular
	.module('app.main', ['ngSanitize',
		'ui.router',
		'restangular',
		'ngAnimate',
		'mobile-angular-ui',
		'mobile-angular-ui.gestures'])
	.directive('roller', () => new Roller())
	.controller('votePollCtrl', VotePollCtrl)
	.controller('pollCtrl', PollCtrl)
	.config(['$stateProvider', '$locationProvider',
		($stateProvider, $locationProvider) => {
			$locationProvider.html5Mode(true);
			$stateProvider
				.state('main', {
					url:'/',
					templateUrl: 'partials/pages/main.html'
				})
				.state('vote', {
					url: '/vote/:id',
					controller: 'pollCtrl as poll',
					templateUrl: 'partials/vote.html'
				});
		}])
	.run((Restangular, $stateParams, $state, $timeout) => {
		setComponents({
			restangular: Restangular,
			stateParams: $stateParams,
			state: $state,
			timeout: $timeout
		});

		console.info('app run - main');
	});

angular
	.element(document)
	.ready(() => {
		bootstrapSocketChannel();
		angular.bootstrap(document.querySelector('body'), ['app.main']);
	});