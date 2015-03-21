'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Interndb Schema
 */
var InterndbSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill the interns name',
		trim: true
	},
	college: {
		type: String,
		default: '',
		required: 'Please enter your college name',
		trim: true
	},
	degree: {
		type: String,
		default: '',
		required: 'please enter valid degree',
		trim: true
	}
	/*created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}*/
});

mongoose.model('Interndb', InterndbSchema);