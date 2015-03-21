'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var interndbs = require('../../app/controllers/interndbs.server.controller');

	// Interndbs Routes
	app.route('/interndbs')
		.get(interndbs.list)
		.post(users.requiresLogin, interndbs.create);

	app.route('/interndbs/:interndbId')
		.get(interndbs.read)
		.put(users.requiresLogin, interndbs.hasAuthorization, interndbs.update)
		.delete(users.requiresLogin, interndbs.hasAuthorization, interndbs.delete);

	// Finish by binding the Interndb middleware
	app.param('interndbId', interndbs.interndbByID);
};
