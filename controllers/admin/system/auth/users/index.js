"use strict";
var passport = require('passport');
var auth = require('../../../../../lib/auth');
var User = require('../../../../../models/system/User');
var UserInfo = require('../../../../../models/UserInfo');
var Role = require('../../../../../models/system/Role');
var branchHelper = require('../../../../../lib/branchHelper');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
module.exports = function(app) {
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('admin/user/signupForm', {
			title: '注册用户',
			message: req.flash('error')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/admin', // redirect to the secure profile section
		failureRedirect: '/admin/users', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	app.get('/', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var condition = {};
		User.paginate(condition, page, 10, function(err, pageCount, users) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '用户列表',
				users: users,
				page: page,
				pageCount: pageCount,
				showMessage: req.flash('showMessage')
			};
			res.render('admin/system/users/index', model);
		}, {
			populate: 'userInfo',
			sortBy: {
				name: 1
			}
		});
	});

	app.get('/:name/delete', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var name = req.params.name;
		User.findOneAndRemove({
			name: name
		}, function(err, user) {
			if (err) {
				return next(err);
			}
			UserInfo.findByIdAndRemove(user.userInfo, function(err, userInfo) {
				if (err) {
					return next(err);
				}
				res.json({
					message: '用户' + user.fullName + '已成功删除'
				});
			});
		});
	});

	app.get('/add', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var model = {
			showMessage: req.flash('showMessage'),
			title: '用户信息维护'
		};
		Role.find({}, function(err, roles) {
			if (err) {
				return next(err);
			}
			var userRoles = [];
			roles.forEach(function(role) {
				if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
					var node = {};
					node.code = role.code;
					node.name = role.name;
					node.checked = false;
					userRoles.push(node);
				}
			})
			model.roles = userRoles;
			res.render('admin/system/users/add', model);
		});
	});

	app.post('/add', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var userInput = req.body.user;
		var userInfoInput = req.body.userInfo;
		var address = userInfoInput.province + userInfoInput.city + userInfoInput.county + userInfoInput.town;
		address = address + ' ' + userInfoInput.address;
		userInfoInput.address = [{
			value: address.trim()
		}];

		var userModel = new User(userInput);
		var userInfoModel = new UserInfo(userInfoInput);
		
		var model = {
			title: '用户信息维护'
		};
		model.user = userInput;
		delete model.user.password;
		userInfoInput.address = userInfoInput.address[0].value;
		model.userInfo = userInfoInput;
		Role.find({}, function(err, roles) {
			userModel.save(function(err, user) {
				if (err) {
					res.locals.err = err;
					res.locals.view = 'admin/system/users/add';
					var userRoles = [];
					roles.forEach(function(role) {
						if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
							var node = {};
							node.code = role.code;
							node.name = role.name;
							if (userModel.roles && userModel.roles.indexOf(role) >= 0) {
								node.checked = '1';
							} else {
								node.checked = '0';
							}
							userRoles.push(node);
						}
					})
					model.roles = userRoles;
					res.locals.model = model;
					return next();
				} else {
					userInfoModel.name = user.name;
					userInfoModel.user = user._id;
					userInfoModel.save(function(err, userInfo) {
						if (err) {
							//回滚
							user.remove(function(err) {
								if (err) {
									return next(err);
								}
							});
							res.locals.err = err;
							res.locals.view = 'admin/system/users/add';
							var userRoles = [];
							roles.forEach(function(role) {
								if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
									var node = {};
									node.code = role.code;
									node.name = role.name;
									if (user.roles && user.roles.indexOf(role) >= 0) {
										node.checked = '1';
									} else {
										node.checked = '0';
									}
									userRoles.push(node);
								}
							})
							model.roles = userRoles;
							res.locals.model = model;
							return next();
						} else {
							User.findByIdAndUpdate(user._id, {
								$set: {
									userInfo: userInfo._id
								}
							}, function(err) {
								if (err) {
									return next(err);
								}
							})
							req.flash('showMessage', '创建成功');
							res.redirect('/admin/system/auth/users');
						}

					});
				}

			});
		});
	});


	app.get('/:name/edit', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var model = {
			showMessage: req.flash('showMessage'),
			title: '用户信息维护'
		};
		Role.find({}, function(err, roles) {
			if (err) {
				return next(err);
			}
			var name = req.params.name;
			User.findOne({
				name: name
			}).
			populate('userInfo').
			exec(function(err, user) {
				model.user = user;
				var userInfo = user.userInfo;
				if (userInfo) {
					var data = {};
					for (var o in userInfo) {
						data[o] = userInfo[o];
					}
					for (var i = 0, l = userInfo.address.length; i < l; i++) {
						if (userInfo.address[i].type === '默认') {
							data.address = userInfo.address[i].value;
							break;
						}
					}
					model.userInfo = data;
				}
				var userRoles = [];
				roles.forEach(function(role) {
					if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
						var node = {};
						node.code = role.code;
						node.name = role.name;
						if (user.roles && user.roles.indexOf(role.code) >= 0) {
							node.checked = '1';
						} else {
							node.checked = '0';
						}
						userRoles.push(node);
					}
				})
				model.roles = userRoles;
				res.render('admin/system/users/add', model);				
			});
		});
	});

	app.post('/:name/edit', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var name = req.params.name;
		var userInput = req.body.user;
		var userInfoInput = req.body.userInfo;
		var address = userInfoInput.province + userInfoInput.city + userInfoInput.county + userInfoInput.town;
		address = address + ' ' + userInfoInput.address;
		userInfoInput.address = [{
			value: address.trim()
		}];
		var model = {
			title: '用户信息维护'
		};
		Role.find({}, function(err, roles) {
			User.findOne({
				name: name
			}, function(err, user) {
				if (err) {
					return next(err);
				}
				for (var o in userInput) {
					user[o] = userInput[o];
				}
				
				user.save(function(err) {
					if (err) {
						model.user = userInput;
						userInfoInput.address = userInfoInput.address[0].value;
						model.userInfo = userInfoInput;
						res.locals.err = err;
						res.locals.view = 'admin/system/users/add';
						var userRoles = [];
						roles.forEach(function(role) {
							if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
								var node = {};
								node.code = role.code;
								node.name = role.name;
								if (user.roles && user.roles.indexOf(role) >= 0) {
									node.checked = '1';
								} else {
									node.checked = '0';
								}
								userRoles.push(node);
							}
						})
						model.roles = userRoles;
						res.locals.model = model;
						return next();
					} else {
						UserInfo.findOne({
							name: name
						}, function(err, userInfo) {
							if (err) {
								return next(err);
							}
							if (userInfo) {
								for (var o in userInfoInput) {
									userInfo[o] = userInfoInput[o]
								}
							} else {
								userInfo = new UserInfo(userInfoInput);
								userInfo.name = user.name;
								userInfo.user = user._id;
							}

							userInfo.save(function(err) {
								if (err) {
									model.user = userInput;
									userInfoInput.address = userInfoInput.address[0].value;
									model.userInfo = userInfoInput;
									res.locals.err = err;
									res.locals.view = 'admin/system/users/add';
									var userRoles = [];
									roles.forEach(function(role) {
										if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
											var node = {};
											node.code = role.code;
											node.name = role.name;
											if (user.roles && user.roles.indexOf(role) >= 0) {
												node.checked = '1';
											} else {
												node.checked = '0';
											}
											userRoles.push(node);
										}
									})
									model.roles = userRoles;
									res.locals.model = model;
									return next();
								} else {
									user.userInfo = userInfo._id;
									user.save(function(err) {
										if (err) {
											return next(err);
										}
										req.flash('showMessage', '更新成功');
										res.redirect('/admin/system/auth/users/' + name + '/edit');
									});
								}
							});
						})
					}
				})
			});
		});
	});
};