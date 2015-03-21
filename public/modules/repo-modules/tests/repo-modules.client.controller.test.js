'use strict';

(function() {
	// Repo modules Controller Spec
	describe('Repo modules Controller Tests', function() {
		// Initialize global variables
		var RepoModulesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Repo modules controller.
			RepoModulesController = $controller('RepoModulesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Repo module object fetched from XHR', inject(function(RepoModules) {
			// Create sample Repo module using the Repo modules service
			var sampleRepoModule = new RepoModules({
				name: 'New Repo module'
			});

			// Create a sample Repo modules array that includes the new Repo module
			var sampleRepoModules = [sampleRepoModule];

			// Set GET response
			$httpBackend.expectGET('repo-modules').respond(sampleRepoModules);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.repoModules).toEqualData(sampleRepoModules);
		}));

		it('$scope.findOne() should create an array with one Repo module object fetched from XHR using a repoModuleId URL parameter', inject(function(RepoModules) {
			// Define a sample Repo module object
			var sampleRepoModule = new RepoModules({
				name: 'New Repo module'
			});

			// Set the URL parameter
			$stateParams.repoModuleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/repo-modules\/([0-9a-fA-F]{24})$/).respond(sampleRepoModule);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.repoModule).toEqualData(sampleRepoModule);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RepoModules) {
			// Create a sample Repo module object
			var sampleRepoModulePostData = new RepoModules({
				name: 'New Repo module'
			});

			// Create a sample Repo module response
			var sampleRepoModuleResponse = new RepoModules({
				_id: '525cf20451979dea2c000001',
				name: 'New Repo module'
			});

			// Fixture mock form input values
			scope.name = 'New Repo module';

			// Set POST response
			$httpBackend.expectPOST('repo-modules', sampleRepoModulePostData).respond(sampleRepoModuleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Repo module was created
			expect($location.path()).toBe('/repo-modules/' + sampleRepoModuleResponse._id);
		}));

		it('$scope.update() should update a valid Repo module', inject(function(RepoModules) {
			// Define a sample Repo module put data
			var sampleRepoModulePutData = new RepoModules({
				_id: '525cf20451979dea2c000001',
				name: 'New Repo module'
			});

			// Mock Repo module in scope
			scope.repoModule = sampleRepoModulePutData;

			// Set PUT response
			$httpBackend.expectPUT(/repo-modules\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/repo-modules/' + sampleRepoModulePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid repoModuleId and remove the Repo module from the scope', inject(function(RepoModules) {
			// Create new Repo module object
			var sampleRepoModule = new RepoModules({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Repo modules array and include the Repo module
			scope.repoModules = [sampleRepoModule];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/repo-modules\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRepoModule);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.repoModules.length).toBe(0);
		}));
	});
}());