'use strict';

// Repo modules controller
angular.module('repo-modules').controller('RepoModulesController', ['$scope', '$stateParams', '$location', 'Authentication', 'RepoModules',
	function($scope, $stateParams, $location, Authentication, RepoModules) {
		$scope.authentication = Authentication;

		// Create new Repo module
		$scope.create = function() {
			// Create new Repo module object
			var repoModule = new RepoModules ({
				name: this.name
			});

			// Redirect after save
			repoModule.$save(function(response) {
				$location.path('repo-modules/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Repo module
		$scope.remove = function(repoModule) {
			if ( repoModule ) { 
				repoModule.$remove();

				for (var i in $scope.repoModules) {
					if ($scope.repoModules [i] === repoModule) {
						$scope.repoModules.splice(i, 1);
					}
				}
			} else {
				$scope.repoModule.$remove(function() {
					$location.path('repo-modules');
				});
			}
		};

		// Update existing Repo module
		$scope.update = function() {
			var repoModule = $scope.repoModule;

			repoModule.$update(function() {
				$location.path('repo-modules/' + repoModule._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Repo modules
		$scope.find = function() {
			$scope.repoModules = RepoModules.query();
		};

		// Find existing Repo module
		$scope.findOne = function() {
			$scope.repoModule = RepoModules.get({ 
				repoModuleId: $stateParams.repoModuleId
			});
		};
	}
]);