'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RepoModule = mongoose.model('RepoModule'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, repoModule;

/**
 * Repo module routes tests
 */
describe('Repo module CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Repo module
		user.save(function() {
			repoModule = {
				name: 'Repo module Name'
			};

			done();
		});
	});

	it('should be able to save Repo module instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Repo module
				agent.post('/repo-modules')
					.send(repoModule)
					.expect(200)
					.end(function(repoModuleSaveErr, repoModuleSaveRes) {
						// Handle Repo module save error
						if (repoModuleSaveErr) done(repoModuleSaveErr);

						// Get a list of Repo modules
						agent.get('/repo-modules')
							.end(function(repoModulesGetErr, repoModulesGetRes) {
								// Handle Repo module save error
								if (repoModulesGetErr) done(repoModulesGetErr);

								// Get Repo modules list
								var repoModules = repoModulesGetRes.body;

								// Set assertions
								(repoModules[0].user._id).should.equal(userId);
								(repoModules[0].name).should.match('Repo module Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Repo module instance if not logged in', function(done) {
		agent.post('/repo-modules')
			.send(repoModule)
			.expect(401)
			.end(function(repoModuleSaveErr, repoModuleSaveRes) {
				// Call the assertion callback
				done(repoModuleSaveErr);
			});
	});

	it('should not be able to save Repo module instance if no name is provided', function(done) {
		// Invalidate name field
		repoModule.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Repo module
				agent.post('/repo-modules')
					.send(repoModule)
					.expect(400)
					.end(function(repoModuleSaveErr, repoModuleSaveRes) {
						// Set message assertion
						(repoModuleSaveRes.body.message).should.match('Please fill Repo module name');
						
						// Handle Repo module save error
						done(repoModuleSaveErr);
					});
			});
	});

	it('should be able to update Repo module instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Repo module
				agent.post('/repo-modules')
					.send(repoModule)
					.expect(200)
					.end(function(repoModuleSaveErr, repoModuleSaveRes) {
						// Handle Repo module save error
						if (repoModuleSaveErr) done(repoModuleSaveErr);

						// Update Repo module name
						repoModule.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Repo module
						agent.put('/repo-modules/' + repoModuleSaveRes.body._id)
							.send(repoModule)
							.expect(200)
							.end(function(repoModuleUpdateErr, repoModuleUpdateRes) {
								// Handle Repo module update error
								if (repoModuleUpdateErr) done(repoModuleUpdateErr);

								// Set assertions
								(repoModuleUpdateRes.body._id).should.equal(repoModuleSaveRes.body._id);
								(repoModuleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Repo modules if not signed in', function(done) {
		// Create new Repo module model instance
		var repoModuleObj = new RepoModule(repoModule);

		// Save the Repo module
		repoModuleObj.save(function() {
			// Request Repo modules
			request(app).get('/repo-modules')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Repo module if not signed in', function(done) {
		// Create new Repo module model instance
		var repoModuleObj = new RepoModule(repoModule);

		// Save the Repo module
		repoModuleObj.save(function() {
			request(app).get('/repo-modules/' + repoModuleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', repoModule.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Repo module instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Repo module
				agent.post('/repo-modules')
					.send(repoModule)
					.expect(200)
					.end(function(repoModuleSaveErr, repoModuleSaveRes) {
						// Handle Repo module save error
						if (repoModuleSaveErr) done(repoModuleSaveErr);

						// Delete existing Repo module
						agent.delete('/repo-modules/' + repoModuleSaveRes.body._id)
							.send(repoModule)
							.expect(200)
							.end(function(repoModuleDeleteErr, repoModuleDeleteRes) {
								// Handle Repo module error error
								if (repoModuleDeleteErr) done(repoModuleDeleteErr);

								// Set assertions
								(repoModuleDeleteRes.body._id).should.equal(repoModuleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Repo module instance if not signed in', function(done) {
		// Set Repo module user 
		repoModule.user = user;

		// Create new Repo module model instance
		var repoModuleObj = new RepoModule(repoModule);

		// Save the Repo module
		repoModuleObj.save(function() {
			// Try deleting Repo module
			request(app).delete('/repo-modules/' + repoModuleObj._id)
			.expect(401)
			.end(function(repoModuleDeleteErr, repoModuleDeleteRes) {
				// Set message assertion
				(repoModuleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Repo module error error
				done(repoModuleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RepoModule.remove().exec();
		done();
	});
});