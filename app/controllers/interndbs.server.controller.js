'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Interndb = mongoose.model('Interndb'),
	_ = require('lodash');

/**
 * Create a Interndb
 */
exports.create = function(req, res) {
	var interndb = new Interndb(req.body);
	interndb.user = req.user;

	interndb.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(interndb);
		}
	});
};

/**
 * Show the current Interndb
 */
exports.read = function(req, res) {
	res.jsonp(req.interndb);
};

/**
 * Update a Interndb
 */
exports.update = function(req, res) {
	var interndb = req.interndb ;

	interndb = _.extend(interndb , req.body);

	interndb.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(interndb);
		}
	});
};

/**
 * Delete an Interndb
 */
exports.delete = function(req, res) {
	var interndb = req.interndb ;

	interndb.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(interndb);
		}
	});
};

/**
 * List of Interndbs
 */
exports.list = function(req, res) { 
	var from = req.query.from;
	var to = req.query.to;
	var sterm = req.query.term;
	if(!sterm){
	Interndb.find().skip(from).limit(to).sort('-created').populate('user', 'displayName').exec(function(err, interndbs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(interndbs);
		}
    });
   }
   else{

    Interndb.find({'name': new RegExp('^'+sterm, 'i')}).skip(from).limit(to).sort('-created').populate('user', 'displayName').exec(function(err, interndbs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(interndbs);
		}
    });
   }
};

/**
 * Interndb middleware
 */
exports.interndbByID = function(req, res, next, id) { 
	Interndb.findById(id).populate('user', 'displayName').exec(function(err, interndb) {
		if (err) return next(err);
		if (! interndb) return next(new Error('Failed to load Interndb ' + id));
		req.interndb = interndb ;
		next();
	});
};

/**
 * Interndb authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.interndb.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
