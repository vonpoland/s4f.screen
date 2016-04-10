import angular from 'angular';
import 'angular-sanitize';
import 'angular-animate';
import AdminCtrl from './admin/AdminCtrl';
import 'restangular';
import 'angular-ui-router';
import setComponents from './di';
import ResultsCtrl from './admin/ResultsCtrl';
import PollCtrl from './poll/ctrl.poll';

angular
	.module('bigScreen.admin', [
		'ngSanitize',
		'restangular',
		'ngMaterial',
		'ngAnimate',
        'ng.jsoneditor',
		'ui.router'])
	.controller('adminCtrl', AdminCtrl)
    .controller('resultsCtrl', ResultsCtrl)
    .controller('pollCtrl', PollCtrl)
	.config(['$stateProvider', '$locationProvider',
		($stateProvider, $locationProvider) => {
			$locationProvider.html5Mode(true);
			$stateProvider
				.state('poll', {
					url: '/admin/:parent',
					controller: 'adminCtrl as Admin',
					templateUrl: 'partials/admin/poll.html'
				})
				.state('edit', {
					url: '/admin/:id/edit',
					controller: 'pollCtrl as Poll',
					templateUrl: 'partials/admin/edit.html'
				})
			.state('results', {
                url: '/admin/:id/results',
				controller: 'resultsCtrl as Results',
                templateUrl: 'partials/admin/results.html'
			});
		}])
	.run((Restangular, $stateParams, $state, $timeout) => {
		setComponents({
			restangular: Restangular,
			stateParams: $stateParams,
			state: $state,
			timeout: $timeout
		});

		console.info('app run - admin');
	});

angular
	.element(document)
	.ready(() => angular.bootstrap(document, ['bigScreen.admin']));