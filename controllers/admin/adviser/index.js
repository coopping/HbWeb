'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var util = require('util');

var auth = require('../../../lib/auth');

module.exports = function(app) {

	app.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {
			title: "欢迎使用保险顾问管理"
		};
		res.render('admin/adviser/index', model);
	});

	app.get('/grade', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		
		res.render('admin/adviser/grade', {});
	});

	app.get('/examine', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		
		res.render('admin/adviser/examine', {});
	});
}