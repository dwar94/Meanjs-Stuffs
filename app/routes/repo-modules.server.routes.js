'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var repoModules = require('../../app/controllers/repo-modules.server.controller');

	// Repo modules Routes
	app.route('/repo-modules')
		.get(repoModules.list)
		.post(users.requiresLogin, repoModules.create);

	app.route('/repo-modules/:repoModuleId')
		.get(repoModules.read)
		.put(users.requiresLogin, repoModules.hasAuthorization, repoModules.update)
		.delete(users.requiresLogin, repoModules.hasAuthorization, repoModules.delete);

	// Finish by binding the Repo module middleware
	app.param('repoModuleId', repoModules.repoModuleByID);
};
