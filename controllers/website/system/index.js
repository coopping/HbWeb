"use strict";
var passport = require('passport');
var auth = require('../../../lib/auth');
var User = require('../../../models/system/User');
var UserInfo = require('../../../models/UserInfo');
var Role = require('../../../models/system/Role');
var SecuURL = require('../../../models/system/SecuURL');
var branchHelper = require('../../../lib/branchHelper');
var mailHelper = require('../../../lib/mailHelper');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var bcrypt = require('bcrypt');
var util = require('util');
module.exports = function(app) {
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('user/signupForm', {
			title: '注册用户',
			message: req.flash('error')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/', // redirect to the secure profile section
		failureRedirect: '/users', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));


	app.get('/:id/signup/resetPass', function(req, res, next) {
		var id = req.params.id;
		var model = {};
			UserInfo.findOne({
			"user": new ObjectId(id)
		},'email', function(err, userInfo) {
			console.log(userInfo);
			if (err) {
				model.err = err.toString();
				return res.json(model);
			}
	
			if (!userInfo) {
				model.err = "请更新该用户的邮箱！"
				return res.json(model);
			}
			var helper = mailHelper.helper();
			var DIFFICULTY = 8;
			var hashedPwd = bcrypt.hashSync(userInfo.name + userInfo.email, DIFFICULTY);
			var secuURL = new SecuURL();
			secuURL.code = hashedPwd;
			secuURL.email = userInfo.email;
			secuURL.save(function(err, secuURL) {
				if (err) {
					model.err = err.toString();
					return res.json(model);
				}
				var mail = {
					from: helper.from,
					to: userInfo.email,
					subject: '初始化密码'
				};
				var clien = helper.localhost;
				var url = util.format( '%s/system/auth/users/resetPassword?code=%s&mail=%s&id=%s', clien, hashedPwd, userInfo.email, secuURL.id);
				res.render('system/users/resetPassMail', {
					url: encodeURI(url)
				}, function(err, html) {
					if (err) {
						model.err = err.toString();
						return res.json(model);
					}
					mail.attachment = [{
						data: html,
						alternative: true
					}];
					helper.server.send(mail, function(err, message) {
						if (err) {
							console.log(err);
							model.err = err.toString();
							return res.json(model);
						}
						model.message = 'ok';
						res.json(model);
					});
				})
			})
		})
	});



	app.post('/signup/resetPass', function(req, res, next) {
		var email = req.body.email;
		var model = {};

		UserInfo.findOne({
			email: email
		}, function(err, userInfo) {
			if (err) {
				model.err = err.toString();
				return res.json(model);
			}
			if (!userInfo) {
				model.err = "该邮箱地址未注册！"
				return res.json(model);
			}
			var helper = mailHelper.helper();
			var DIFFICULTY = 8;
			var hashedPwd = bcrypt.hashSync(userInfo.name + userInfo.email, DIFFICULTY);
			var secuURL = new SecuURL();
			secuURL.code = hashedPwd;
			secuURL.email = email;
			secuURL.save(function(err, secuURL) {
				if (err) {
					model.err = err.toString();
					return res.json(model);
				}
				var mail = {
					from: helper.from,
					to: email,
					subject: '重置密码'
				};
				var url = util.format( '%s/system/auth/users/resetPassword?code=%s&mail=%s&id=%s', helper.localhost, hashedPwd, email, secuURL.id);
				res.render('system/users/resetPassMail', {
					url: encodeURI(url)
				}, function(err, html) {
					if (err) {
						model.err = err.toString();
						return res.json(model);
					}
					mail.attachment = [{
						data: html,
						alternative: true
					}];
					helper.server.send(mail, function(err, message) {
						if (err) {
							console.log(err);
							model.err = err.toString();
							return res.json(model);
						}
						model.message = 'ok';
						res.json(model);
					});
				})
			})
		})
	});
	app.get('/resetPassword', auth.isAllowedFromMail(), function(req, res, next) {
		var id = req.query.id;
		var mail = req.query.mail;
		var code = req.query.code;
		var model = {
			title: '重置密码',
			showMessage: req.flash('showMessage'),
			showErrorMessage: req.flash('showErrorMessage'),
			id: id,
			mail: mail,
			code: code,
			fromMail: 'true'
		};
		res.render('user/resetPassword', model);
	});
	//
	app.post('/resetPassword',auth.isAllowedFromMail(), function(req, res, next) {
		var name = res.locals.mailUserName;
		var newPassword = req.body.newPassword;
		var code = req.body.code;
		console.log(name);
		User.findOne({
			name: name
		}, function(err, user) {
			if (err) {
				return next(err);
			}
			var model = {};
			user.password = newPassword;
			user.save(function(err) {
				if (err) {
					return next(err);
				}
				SecuURL.remove({
					code: code
				}, function(err) {
					if (err) {
						return next(err);
					}
					req.flash('showMessage', '修改成功');
					res.redirect('/');
				});

			})
		});
	});
	app.get('/', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}

		var fullName = req.query.fullName;
		
		var condition = {"status":{"$ne":'3'}};

		if(fullName){
			condition.fullName = new RegExp(fullName);
		}

		auth.branchCondition(condition, req.user, 'branch'); //限制机构范围
		console.log(condition);
		User.paginate(condition, page, 5, function(err, pageCount, users) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '用户列表',
				users: users,
				page: page,
				pageCount: pageCount,
				fullName:fullName,
				showMessage: req.flash('showMessage')
			};
			res.render('system/users/index', model);
		}, {
			populate: 'userInfo',sortBy: {name: 1}
		});
	});


	app.post('/', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var fullName = req.body.user.fullName;
		
		var condition = {"status":{"$ne":'3'}};

		if(fullName){
			condition.fullName = new RegExp(fullName);
		}

		auth.branchCondition(condition, req.user, 'branch'); //限制机构范围

		User.paginate(condition, page, 5, function(err, pageCount, users) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '用户列表',
				users: users,
				page: page,
				pageCount: pageCount,
				fullName:fullName,
				showMessage: req.flash('showMessage')
			};
			res.render('system/users/index', model);
		}, {
			populate: 'userInfo',
			sortBy: {
				name: 1
			}
		});
	});

	app.get('/:name/delete', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var name = req.params.name;
		User.update({"_id":new ObjectId(name)},{"$set":{"status":'3'}}, function(err, user) {
			console.log(err);
			if (err) {
				return next(err);
			}
			res.json({
				message: '用户' + user.fullName + '已成功注销'
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
					if(req.user.userType==='2'){//保险公司
						if(role.code.indexOf('JD') < 0){
							var node = {};
								node.code = role.code;
							    node.name = role.name;
							    if ('ROLE_USER'.indexOf(role.code) >= 0) {
									node.checked = '1';
								} else {
									node.checked = '0';
								}
								userRoles.push(node);
						}
					}else if(req.user.userType==='3'){//中介公司
						if(role.code.indexOf('BX') < 0){
							var node = {};
								node.code = role.code;
							    node.name = role.name;
							    if ('ROLE_USER'.indexOf(role.code) >= 0) {
									node.checked = '1';
								} else {
									node.checked = '0';
								}
								userRoles.push(node);
						}
					}else{
						var node = {};
							node.code = role.code;
							node.name = role.name;
							if ('ROLE_USER'.indexOf(role.code) >= 0) {
								node.checked = '1';
							} else {
								node.checked = '0';
							}
							userRoles.push(node);
					}
				}
			})
			model.roles = userRoles;
			branchHelper.branchTree(function(branchTree) {
				var userBranches = branchHelper.getUserOprBranches(req.user, [], branchTree);
				model.userBranches = userBranches;
				res.render('system/users/add', model);
			});
		});
	});

	app.post('/add', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var userInput = req.body.user;
		var userInfoInput = req.body.userInfo;
		var address = userInfoInput.address;
		userInput.status = '1' ;
		userInfoInput.address = [{
			value: address.trim()
		}];

		var userModel = new User(userInput);
		var userInfoModel = new UserInfo(userInfoInput);

		if (userInput.oprBranches && userInput.oprBranches.length > 0) {
			userModel.oprBranches = branchHelper.getOprBranches(userInput.oprBranches);
		}

		var model = {
			title: '用户信息维护'
		};
		model.user = userInput;
		
		userInfoInput.address = userInfoInput.address[0].value;
		model.userInfo = userInfoInput;
		Role.find({}, function(err, roles) {
			userModel.save(function(err, user) {
				if (err) {
					res.locals.err = err;
					res.locals.view = 'system/users/add';
					branchHelper.branchTree(function(branchTree) {
						var userBranches = branchHelper.getUserOprBranches(req.user, user.oprBranches, branchTree);
						model.userBranches = userBranches;
						var userRoles = [];
						roles.forEach(function(role) {
							if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
								if(req.user.userType==='2'){//保险公司
										if(user.roles&& role.code.indexOf('JD') < 0){
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
								}else if(req.user.userType==='3'){//中介公司
										if(user.roles&& role.code.indexOf('BX') < 0){
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
								}else{
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
							}
						})
						model.roles = userRoles;
						res.locals.model = model;
						return next();
					});
				}
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
						res.locals.view = 'system/users/add';
						branchHelper.branchTree(function(branchTree) {
							var userBranches = branchHelper.getUserOprBranches(req.user, user.oprBranches, branchTree);
							model.userBranches = userBranches;
							var userRoles = [];
							roles.forEach(function(role) {
								if (req.user.roles.indexOf('ROLE_ADMIN') >= 0 || (role.code != 'ROLE_ADMIN' && role.code != 'ROLE_BRANCH_ADMIN')) {
									if(req.user.userType==='2'){//保险公司
										if(user.roles&& role.code.indexOf('JD') < 0){
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
									}else if(req.user.userType==='3'){//中介公司
										if(user.roles&& role.code.indexOf('BX') < 0){
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
									}else{
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
								}
							})
							model.roles = userRoles;
							res.locals.model = model;
							return next();
						});
					}
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
					res.redirect('/system/auth/users');
				});
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
								if(req.user.userType==='2'){//保险公司
									if(user.roles&& role.code.indexOf('JD') < 0){
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
								}else if(req.user.userType==='3'){//中介公司
									if(user.roles&& role.code.indexOf('BX') < 0){
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
								}else{
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
					}
				})
				model.roles = userRoles;
				branchHelper.branchTree(function(branchTree) {
					var userBranches = branchHelper.getUserOprBranches(req.user, user.oprBranches, branchTree);
					model.userBranches = userBranches;
					res.render('system/users/add', model);
				});
			});
		});
	});

	app.post('/:name/edit', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var name = req.params.name;
		var userInput = req.body.user;
		var userInfoInput = req.body.userInfo;
		var address = userInfoInput.address;
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
				if (userInput.oprBranches && userInput.oprBranches.length > 0) {
					user.oprBranches = branchHelper.getOprBranches(userInput.oprBranches);
				}
				
				user.save(function(err, user) {
					if (err) {
						model.user = userInput;
						userInfoInput.address = userInfoInput.address[0].value;
						model.userInfo = userInfoInput;
						res.locals.err = err;
						res.locals.view = 'system/users/add';
						branchHelper.branchTree(function(branchTree) {
							var userBranches = branchHelper.getUserOprBranches(req.user, user.oprBranches, branchTree);
							model.userBranches = userBranches;
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
						});
					}
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
								res.locals.view = 'system/users/add';
								branchHelper.branchTree(function(branchTree) {
									var userBranches = branchHelper.getUserOprBranches(req.user, user.oprBranches, branchTree);
									model.userBranches = userBranches;
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
								});
							}
							user.userInfo = userInfo._id;
							user.save(function(err) {
								if (err) {
									return next(err);
								}
								req.flash('showMessage', '更新成功');
								res.redirect('/system/auth/users/' + name + '/edit');
							});
						});
					})
				})
			});
		});
	});
};