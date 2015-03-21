'use strict';

(function() {
	// Interndbs Controller Spec
	describe('Interndbs Controller Tests', function() {
		// Initialize global variables
		var InterndbsController,
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

			// Initialize the Interndbs controller.
			InterndbsController = $controller('InterndbsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Interndb object fetched from XHR', inject(function(Interndbs) {
			// Create sample Interndb using the Interndbs service
			var sampleInterndb = new Interndbs({
				name: 'New Interndb'
			});

			// Create a sample Interndbs array that includes the new Interndb
			var sampleInterndbs = [sampleInterndb];

			// Set GET response
			$httpBackend.expectGET('interndbs').respond(sampleInterndbs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.interndbs).toEqualData(sampleInterndbs);
		}));

		it('$scope.findOne() should create an array with one Interndb object fetched from XHR using a interndbId URL parameter', inject(function(Interndbs) {
			// Define a sample Interndb object
			var sampleInterndb = new Interndbs({
				name: 'New Interndb'
			});

			// Set the URL parameter
			$stateParams.interndbId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/interndbs\/([0-9a-fA-F]{24})$/).respond(sampleInterndb);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.interndb).toEqualData(sampleInterndb);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Interndbs) {
			// Create a sample Interndb object
			var sampleInterndbPostData = new Interndbs({
				name: 'New Interndb'
			});

			// Create a sample Interndb response
			var sampleInterndbResponse = new Interndbs({
				_id: '525cf20451979dea2c000001',
				name: 'New Interndb'
			});

			// Fixture mock form input values
			scope.name = 'New Interndb';

			// Set POST response
			$httpBackend.expectPOST('interndbs', sampleInterndbPostData).respond(sampleInterndbResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Interndb was created
			expect($location.path()).toBe('/interndbs/' + sampleInterndbResponse._id);
		}));

		it('$scope.update() should update a valid Interndb', inject(function(Interndbs) {
			// Define a sample Interndb put data
			var sampleInterndbPutData = new Interndbs({
				_id: '525cf20451979dea2c000001',
				name: 'New Interndb'
			});

			// Mock Interndb in scope
			scope.interndb = sampleInterndbPutData;

			// Set PUT response
			$httpBackend.expectPUT(/interndbs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/interndbs/' + sampleInterndbPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid interndbId and remove the Interndb from the scope', inject(function(Interndbs) {
			// Create new Interndb object
			var sampleInterndb = new Interndbs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Interndbs array and include the Interndb
			scope.interndbs = [sampleInterndb];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/interndbs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInterndb);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.interndbs.length).toBe(0);
		}));
	});
}());