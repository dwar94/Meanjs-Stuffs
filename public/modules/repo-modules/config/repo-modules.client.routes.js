'use strict';

//Setting up route
angular.module('repo-modules').config(['$stateProvider',
	function($stateProvider) {
		// Repo modules state routing
		$stateProvider.
		state('listRepoModules', {
			url: '/repo-modules',
			templateUrl: 'modules/repo-modules/views/list-repo-modules.client.view.html'
		}).
		state('createRepoModule', {
			url: '/repo-modules/create',
			templateUrl: 'modules/repo-modules/views/create-repo-module.client.view.html'
		}).
		state('viewRepoModule', {
			url: '/repo-modules/:repoModuleId',
			templateUrl: 'modules/repo-modules/views/view-repo-module.client.view.html'
		}).
		state('editRepoModule', {
			url: '/repo-modules/:repoModuleId/edit',
			templateUrl: 'modules/repo-modules/views/edit-repo-module.client.view.html'
		});
	}
]);