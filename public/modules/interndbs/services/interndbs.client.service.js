'use strict';

//Interndbs service used to communicate Interndbs REST endpoints
angular.module('interndbs').factory('Interndbs', ['$resource',
	function($resource) {
		return $resource('interndbs/:interndbId', { interndbId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);