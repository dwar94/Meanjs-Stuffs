'use strict';

//Repo modules service used to communicate Repo modules REST endpoints
angular.module('repo-modules').factory('RepoModules', ['$resource',
	function($resource) {
		return $resource('repo-modules/:repoModuleId', { repoModuleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);