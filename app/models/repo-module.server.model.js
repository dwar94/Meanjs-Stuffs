'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Repo module Schema
 */
var RepoModuleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Repo module name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('RepoModule', RepoModuleSchema);