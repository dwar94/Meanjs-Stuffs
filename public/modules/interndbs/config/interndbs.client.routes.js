'use strict';

//Setting up route
angular.module('interndbs').config(['$stateProvider',
	function($stateProvider) {
		// Interndbs state routing
		$stateProvider.
		state('listInterndbs', {
			url: '/interndbs',
			templateUrl: 'modules/interndbs/views/list-interndbs.client.view.html'
		}).
		state('createInterndb', {
			url: '/interndbs/create',
			templateUrl: 'modules/interndbs/views/create-interndb.client.view.html'
		}).
		state('viewInterndb', {
			url: '/interndbs/:interndbId',
			templateUrl: 'modules/interndbs/views/view-interndb.client.view.html'
		}).
		state('editInterndb', {
			url: '/interndbs/:interndbId/edit',
			templateUrl: 'modules/interndbs/views/edit-interndb.client.view.html'
		});
	}
]);