import angular from 'angular';
import 'angular-sanitize';
import 'angular-animate';
import AdminCtrl from './admin/AdminCtrl';
import 'restangular';
import 'angular-ui-router';
import setComponents from './di';

angular
	.module('bigScreen.admin', [
		'ngSanitize',
		'restangular',
		'ngMaterial',
		'ngAnimate',
		'ui.router'])
	.controller('adminCtrl', AdminCtrl)
	.config(['$stateProvider', '$locationProvider',
		($stateProvider, $locationProvider) => {
			$locationProvider.html5Mode(true);
			$stateProvider
				.state('main', {
					url: '/admin'
				})
				.state('poll', {
					url: '/admin/:id',
					controller: 'adminCtrl as admin',
					templateUrl: 'partials/admin/poll.html'
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
	.ready(() => {
		angular.bootstrap(document, ['bigScreen.admin']);
	});