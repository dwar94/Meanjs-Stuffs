'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	RepoModule = mongoose.model('RepoModule'),
	_ = require('lodash');

/**
 * Create a Repo module
 */
exports.create = function(req, res) {
	var repoModule = new RepoModule(req.body);
	repoModule.user = req.user;

	repoModule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repoModule);
		}
	});
};

/**
 * Show the current Repo module
 */
exports.read = function(req, res) {
	res.jsonp(req.repoModule);
};

/**
 * Update a Repo module
 */
exports.update = function(req, res) {
	var repoModule = req.repoModule ;

	repoModule = _.extend(repoModule , req.body);

	repoModule.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repoModule);
		}
	});
};

/**
 * Delete an Repo module
 */
exports.delete = function(req, res) {
	var repoModule = req.repoModule ;

	repoModule.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repoModule);
		}
	});
};

/**
 * List of Repo modules
 */
exports.list = function(req, res) { 
	RepoModule.find().sort('-created').populate('user', 'displayName').exec(function(err, repoModules) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(repoModules);
		}
	});
};

/**
 * Repo module middleware
 */
exports.repoModuleByID = function(req, res, next, id) { 
	RepoModule.findById(id).populate('user', 'displayName').exec(function(err, repoModule) {
		if (err) return next(err);
		if (! repoModule) return next(new Error('Failed to load Repo module ' + id));
		req.repoModule = repoModule ;
		next();
	});
};

/**
 * Repo module authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.repoModule.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
