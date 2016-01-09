import angular from 'angular';
import 'angular-sanitize';
import 'angular-ui-router';
import 'angular-animate';
import 'cornflourblue/angulike';
import 'jquery';
import Roller from './poll/directive.roller';
import VotePollCtrl from './poll/ctrl.vote';
import PollCtrl from './poll/ctrl.poll';
import 'restangular';
import setComponents from './di';
import facebook from './auth/facebook.service';

angular
	.module('app.main', ['ngSanitize',
		'ui.router',
		'restangular',
		'ngAnimate',
		'ngMaterial',
		'angulike'])
	.directive('roller', () => new Roller())
	.controller('AppCtrl', function ($scope, $mdSidenav) {
		this.onSwipeLeft = () => $mdSidenav('left').toggle();
		this.onSwipeRight = () => $mdSidenav('left').toggle();
	})
	.controller('votePollCtrl', VotePollCtrl)
	.controller('pollCtrl', PollCtrl)
	.config(['$stateProvider', '$locationProvider',
		($stateProvider, $locationProvider) => {
			$locationProvider.html5Mode(true);
			//$mdThemingProvider.theme('default')
			//	.primaryPalette('blue')
			//	.accentPalette('teal');
			$stateProvider
				.state('main', {
					url: '/',
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

		facebook.init();
	});

angular
	.element(document)
	.ready(() => {
		angular.bootstrap(document.querySelector('body'), ['app.main']);
	});