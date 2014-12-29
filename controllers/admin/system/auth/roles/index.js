"use strict";
var auth = require('../../../../../lib/auth');
var menuHelper = require('../../../../../lib/menuHelper');
var clientHelper = require('../../../../../lib/clientHelper');
var Role = require('../../../../../models/system/Role');
var Menu = require('../../../../../models/system/Menu');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var async = require('async');
var _ = require("underscore");
module.exports = function(app) {
	app.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		Role.paginate({}, page, 10, function(err, pageCount, roles) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '角色列表',
				roles: roles,
				page: page,
				pageCount: pageCount,
				showMessage: req.flash('showMessage')
			};
			res.render('admin/system/roles/index', model);
		}, {
			sortBy: {
				createdAt: -1
			}
		});
	});

	app.post('/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var role = req.body.role;

		var roleModel = new Role(role);
		roleModel.save(function(err) {
			if (err) {
				var model = {
					role: role
				};
				res.locals.err = err;
				res.locals.view = 'admin/system/roles/index';
				res.locals.model = model;
				return next();
			}
			req.flash('showMessage', '创建成功');
			res.redirect('/admin/system/auth/roles');
		});
	});

	app.get('/:id/load', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Role.findById(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			res.json(role);
		});
	});
	app.post('/:id/save', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var roleInput = req.body.role;
		Role.findById(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			for (var o in roleInput) {
				role[o] = roleInput[o];
			}
			role.save(function(err, role) {
				if (err) {
					var model = {
						role: roleInput
					};
					res.locals.err = err;
					res.locals.view = 'admin/system/roles';
					res.locals.model = model;
					return next(); //调用下一个错误处理middlewear
				}
				req.flash('showMessage', '修改成功');
				res.redirect('/admin/system/auth/roles');
			});
		});
	});
	app.get('/:id/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Role.findByIdAndRemove(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			res.json({
				message: 'OK'
			});
		});
	});
	app.get('/:id/addMenus', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var model = {};


		Role.findById(new ObjectId(id), 'name menus', function(err, role) {
			if (err) {
				return next(err);

			}

			model.title = '分配角色（' + role.name + '）菜单';
			model.role = role;
			model.clients = clientHelper.getClients();
			res.render('admin/system/roles/addMenus', model);
		});
	});

	app.get('/:id/showMenuTree', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var model = {};
		var application = req.query.application;
		menuHelper.getMenuTree(application, function(menuTree) {

			Role.findById(new ObjectId(id), 'name menus', function(err, role) {
				if (err) {
					return next(err);

				}
				for (var i = 0, l = menuTree.length; i < l; i++) {
					var menuInfo = menuTree[i];
					for (var ii = 0, ll = menuInfo.children.length; ii < ll; ii++) {
						if (role.menus.indexOf(new ObjectId(menuInfo.children[ii].id)) >= 0) {
							//menuInfo.children[ii].state = {};
							menuInfo.children[ii].state.selected = true;
						}
					}
				}
				model.title = '分配角色（' + role.name + '）菜单';
				model.menuTree = {
					id: '0000',
					text: 'root',
					children: menuTree
				};
				model.role = role;
				model.clients = clientHelper.getClients();
				model.select = 'true';

				res.json(model);

				
			});
		});
	});

	app.get('/:id/applyMenu/:menuId', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var menuId = req.params.menuId;
		var application = req.query.application;
		var select = req.query.select;
		Role.findById(id, function(err, role) {
			if (err) {
				return next(err);
			}
			async.waterfall([

				function(cb) {
					menuHelper.getMenuTree(application, function(menuTree) {
						if (menuId === '0000') {
							cb(null, menuTree, '0');
						} else {
							Menu.findById(menuId, function(err, menu) {
								if (err) {
									return next(err);
								}
								cb(null, menuTree, menu.levelId);
							})
						}
					})
				},
				function(menuTree, level, cb) {
					if (level === '0') {
						for (var i = 0, l = menuTree.length; i < l; i++) {
							var position = role.menus.indexOf(new ObjectId(menuTree[i].id));
							if (position >= 0 && select === 'false') {
								role.menus.splice(position, 1);
							} else if (position < 0 && select === 'true'){
								role.menus.push(new ObjectId(menuTree[i].id));
							}
							for (var ii = 0, ll = menuTree[i].children.length; ii < ll; ii++) {
								var position = role.menus.indexOf(new ObjectId(menuTree[i].children[ii].id));
								if (position >= 0 && select === 'false') {
									role.menus.splice(position, 1);
								} else if (position < 0 && select === 'true') {
									role.menus.push(new ObjectId(menuTree[i].children[ii].id));
								}
							}
						}
					} else if (level === '1') {
						var position = role.menus.indexOf(menuId);
						if (position >= 0 && select === 'false') {
							role.menus.splice(position, 1);
						} else if (select === 'true') {
							role.menus.push(new ObjectId(menuId));
						}
						var menu = _.find(menuTree, function(menu) {
							return menu.id === menuId;
						});
						for (var ii = 0, ll = menu.children.length; ii < ll; ii++) {
							var position = role.menus.indexOf(new ObjectId(menu.children[ii].id));
							if (position >= 0 && select === 'false') {
								role.menus.splice(position, 1);
							} else if (position < 0 && select === 'true') {
								role.menus.push(new ObjectId(menu.children[ii].id));
							}
						}
					} else if (level === '2') {

						var menu = _.find(menuTree, function(menu) {
							var find = false;
							for (var i = 0, l = menu.children.length; i < l; i++) {
								if (menu.children[i].id === menuId) {
									find = true;
									break;
								}
							}
							return find;
						});
						var position = role.menus.indexOf(menuId);
						if (position >= 0 && select === 'false') {
							role.menus.splice(position, 1);
							var p = role.menus.indexOf(menu.id);
							var has = false;
							for (var i = 0, l = menu.children.length; i < l; i++) {
								if (role.menus.indexOf(menu.children[i].id) >= 0) {
									has = true;
									break;
								}
							}
							if (!has) {
								role.menus.splice(p, 1);
							}
						} else if (position < 0 && select === 'true'){
							role.menus.push(new ObjectId(menuId));
							var p = role.menus.indexOf(menu.id);
							if (p < 0) {
								role.menus.push(new ObjectId(menu.id));
							}
						}
					} else {
						console.log('do nothing');
						//do nothing
					}
					cb(err, 'ok');
				}
			], function(err, result) {
				if (err) {
					return next(err);
				}
				role.save(function(err) {
					if (err) {
						return next(err);
					}
					res.json({
						message: '更新成功'
					});
				});
			});
		});
	});


};