'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var util = require('util');

var auth = require('../../../lib/auth');
var Provider = require('../../../models/Provider');

module.exports = function(app) {

	app.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {
			title: "欢迎使用保险公司管理"
		};
		res.render('admin/companyinfo/index', model);
	});


	app.get('/query', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var providerName = req.query.providerName;
		var providerCode = req.query.providerCode;
		var condition = {};
		if (providerName) {
			condition.providerName = providerName;
		}
		if (providerCode) {
			condition.providerCode = providerCode;
		}

		Provider.paginate(condition, page, 5, function(err, pageCount, providers) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '保险公司列表',
				isAdmin: true,
				provider: providers,
				page: page,
				pageCount: pageCount,
				providerName: providerName,
				providerCode: providerCode
			};
			res.render('admin/companyinfo/list', model);
		}, {
			sortBy: {
				_id: -1
			}
		});

	});


	//根据条件查询出供应商列表
	app.post('/findProviders', function(req, res, next) {
		var provider = req.body.provider;
		var providerName = provider.providerName;
		var providerCode = provider.providerCode;
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var condition = {};
		if (providerName != '') {
			condition.providerName = new RegExp(providerName);
		}
		if (providerCode != '') {
			condition.providerCode = new RegExp(providerCode);
		}

		Provider.paginate(condition, page, 5, function(err, pageCount, provider) {
			if (err) {
				return next(err);
			} else {
				var model = {
					isAdmin: true,
					provider: provider,
					page: page,
					pageCount: pageCount,
					providerName: providerName,
					providerCode: providerCode
				};
				res.render('admin/companyinfo/list', model);
			}
		}, {
			sortBy: {
				_id: '-1'
			}
		});
	});

	//跳转到修改
	app.get('/:id/edit', function(req, res, next) {
		var id = req.params.id;
		Provider.findById(new ObjectId(id), function(err, providers) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '修改供应商',
				provider: providers
			};
			res.render('admin/companyinfo/update', model);
		});
	});

	//修改
	app.post('/:id/edit', function(req, res) {
		var id = req.params.id;
		var provider = req.body.provider;
		Provider.update({
			_id: new ObjectId(id)
		}, provider, {
			multi: true
		}, function(err) {
			if (err) {
				return next(err);
			}
			res.redirect('/admin/companyinfo/maint');
		});
	});

	//保险公司信息维护
	app.get('/maint', function(req, res, next) {
		var branch = req.user.branch.substr(0, 4);
		var condition = {
			'gcode': branch
		};

		Provider.find(condition, function(err, providers) { //gcode 指定当前登录人所在机构
			if (err) {
				return next(err);
			} else {
				var model = {
					provider: providers[0]
				}
				res.render('admin/companyinfo/maint', model);
			}
		});

	});
}