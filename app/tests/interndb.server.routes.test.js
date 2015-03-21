'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Interndb = mongoose.model('Interndb'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, interndb;

/**
 * Interndb routes tests
 */
describe('Interndb CRUD tests', function() {
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

		// Save a user to the test db and create new Interndb
		user.save(function() {
			interndb = {
				name: 'Interndb Name'
			};

			done();
		});
	});

	it('should be able to save Interndb instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Interndb
				agent.post('/interndbs')
					.send(interndb)
					.expect(200)
					.end(function(interndbSaveErr, interndbSaveRes) {
						// Handle Interndb save error
						if (interndbSaveErr) done(interndbSaveErr);

						// Get a list of Interndbs
						agent.get('/interndbs')
							.end(function(interndbsGetErr, interndbsGetRes) {
								// Handle Interndb save error
								if (interndbsGetErr) done(interndbsGetErr);

								// Get Interndbs list
								var interndbs = interndbsGetRes.body;

								// Set assertions
								(interndbs[0].user._id).should.equal(userId);
								(interndbs[0].name).should.match('Interndb Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Interndb instance if not logged in', function(done) {
		agent.post('/interndbs')
			.send(interndb)
			.expect(401)
			.end(function(interndbSaveErr, interndbSaveRes) {
				// Call the assertion callback
				done(interndbSaveErr);
			});
	});

	it('should not be able to save Interndb instance if no name is provided', function(done) {
		// Invalidate name field
		interndb.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Interndb
				agent.post('/interndbs')
					.send(interndb)
					.expect(400)
					.end(function(interndbSaveErr, interndbSaveRes) {
						// Set message assertion
						(interndbSaveRes.body.message).should.match('Please fill Interndb name');
						
						// Handle Interndb save error
						done(interndbSaveErr);
					});
			});
	});

	it('should be able to update Interndb instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Interndb
				agent.post('/interndbs')
					.send(interndb)
					.expect(200)
					.end(function(interndbSaveErr, interndbSaveRes) {
						// Handle Interndb save error
						if (interndbSaveErr) done(interndbSaveErr);

						// Update Interndb name
						interndb.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Interndb
						agent.put('/interndbs/' + interndbSaveRes.body._id)
							.send(interndb)
							.expect(200)
							.end(function(interndbUpdateErr, interndbUpdateRes) {
								// Handle Interndb update error
								if (interndbUpdateErr) done(interndbUpdateErr);

								// Set assertions
								(interndbUpdateRes.body._id).should.equal(interndbSaveRes.body._id);
								(interndbUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Interndbs if not signed in', function(done) {
		// Create new Interndb model instance
		var interndbObj = new Interndb(interndb);

		// Save the Interndb
		interndbObj.save(function() {
			// Request Interndbs
			request(app).get('/interndbs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Interndb if not signed in', function(done) {
		// Create new Interndb model instance
		var interndbObj = new Interndb(interndb);

		// Save the Interndb
		interndbObj.save(function() {
			request(app).get('/interndbs/' + interndbObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', interndb.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Interndb instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Interndb
				agent.post('/interndbs')
					.send(interndb)
					.expect(200)
					.end(function(interndbSaveErr, interndbSaveRes) {
						// Handle Interndb save error
						if (interndbSaveErr) done(interndbSaveErr);

						// Delete existing Interndb
						agent.delete('/interndbs/' + interndbSaveRes.body._id)
							.send(interndb)
							.expect(200)
							.end(function(interndbDeleteErr, interndbDeleteRes) {
								// Handle Interndb error error
								if (interndbDeleteErr) done(interndbDeleteErr);

								// Set assertions
								(interndbDeleteRes.body._id).should.equal(interndbSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Interndb instance if not signed in', function(done) {
		// Set Interndb user 
		interndb.user = user;

		// Create new Interndb model instance
		var interndbObj = new Interndb(interndb);

		// Save the Interndb
		interndbObj.save(function() {
			// Try deleting Interndb
			request(app).delete('/interndbs/' + interndbObj._id)
			.expect(401)
			.end(function(interndbDeleteErr, interndbDeleteRes) {
				// Set message assertion
				(interndbDeleteRes.body.message).should.match('User is not logged in');

				// Handle Interndb error error
				done(interndbDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Interndb.remove().exec();
		done();
	});
});