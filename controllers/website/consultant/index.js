'use strict';

var passport = require('passport');
var auth = require('../../../lib/auth');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Agent = require('../../../models/back/InsuranceAgent');

/**
 *首页->专业顾问模块
 */
module.exports = function(app) {

	/**进入列表页面，显示所有的保险代理人**/
	app.get('/', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var condition = {};

		Agent.paginate(condition, page, 3, function(err, pageCount, agents) {
			if (err) {
				next(err);
			}
			var model = {};
			model.agents = agents;
			model.page = page;
			model.pageCount = pageCount;

			res.render('website/consultant/consultant', model);
		});
	});

	//代理人详情页面
	app.get('/:id/consultant-detail', function(req, res) {
		var id = req.params.id;
		Agent.findById(new ObjectId(id), function(err, agent) {
			if (err) {
				return next(err);
			}
			var model = {};
			model.agent = agent;
			res.render('website/consultant/consultant-detail', model);
		});
	});
}