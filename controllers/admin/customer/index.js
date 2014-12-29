'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var util = require('util');

var auth = require('../../../lib/auth');

module.exports = function(app) {

	app.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {
			title: "欢迎使用客户管理"
		};
		res.render('admin/customer/index', model);
	});

	app.get('/query', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		
		res.render('admin/customer/list', {});
	});
}