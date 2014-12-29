'use strict';
var User = require('../../../models/system/User');
var auth = require('../../../lib/auth');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var moment = require('moment');

var Customer = require('../../../models/Customer');
var Contract = require('../../../models/Contract');

/**
 *会员中心(代理人)
 */
module.exports = function(app) {

	//会员中心
	app.get('/member-center', function(req, res) {
		res.render('website/center/member-center', {});
	});

	//我的客户管理
	app.get('/my-customer', function(req, res, next) {

		var page = 1;
		var condition = {};
		if (req.query.page) {
			page = req.query.page;
		}

		var customName = req.query.customName;
		var customPhone = req.query.customPhone;
		var customAddress = req.query.customAddress;
		if (customName) {
			condition['applicant.applicantname'] = new RegExp(customName);
		}
		if (customPhone) {
			condition['applicant.contractmobile'] = new RegExp(customPhone);
		}
		if (customAddress) {
			condition['applicant.address'] = new RegExp(customAddress);
		}

		Customer.paginate(condition, page, 5, function(err, pageCount, customers) {
			if (err) {
				return next(err);
			}
			var model = {
				customers: customers,
				page: page,
				pageCount: pageCount,
				customName: customName,
				customPhone: customPhone,
				customAddress: customAddress
			};
			res.render('website/center/my-customer', model);
		}, {
			sortBy: {_id: '-1'}
		});
	});

	//我的客户管理
	app.post('/my-customer', function(req, res, next) {

		var page = 1;
		var condition = {};
		if (req.query.page) {
			page = req.query.page;
		}

		var customName = req.body.customName;
		var customPhone = req.body.customPhone;
		var customAddress = req.body.customAddress;
		if (customName) {
			condition['applicant.applicantname'] = new RegExp(customName);
		}
		if (customPhone) {
			condition['applicant.contractmobile'] = new RegExp(customPhone);
		}
		if (customAddress) {
			condition['applicant.address'] = new RegExp(customAddress);
		}

		Customer.paginate(condition, page, 5, function(err, pageCount, customers) {
			if (err) {
				return next(err);
			}
			var model = {
				customers: customers,
				page: page,
				pageCount: pageCount,
				customName: customName,
				customPhone: customPhone,
				customAddress: customAddress
			};
			res.render('website/center/my-customer', model);
		}, {
			sortBy: {_id: '-1'}
		});
	});

	//保单管理
	app.get('/policy-manage', function(req, res) {

		var page = 1;
		var condition = {};
		if(req.query.page){
			page = req.query.page;
		}
		var applicantname = req.query.applicantname;
		var effectiveDate = req.query.effectiveDate;
		if (applicantname) {
			condition.applicantname = new RegExp(applicantname);
		}		
		if (effectiveDate) {
			condition.effectiveDate = {"$gte":new Date(effectiveDate),"$lte":new Date(effectiveDate)};
		}

		Contract.paginate(condition, page, 5, function(err, pageCount, policys) {
			if (err) {
				return next(err);
			}
			var model = {
				policys: policys,
				page: page,
				pageCount: pageCount,
				applicantname: applicantname,
				effectiveDate: effectiveDate
			};
			res.render('website/center/policy-manage', model);
		}, {
			sortBy: {_id: '-1'}
		});		
	});

	//保单管理
	app.post('/policy-manage', function(req, res) {

		var page = 1;
		var condition = {};
		if(req.query.page){
			page = req.query.page;
		}
		var applicantname = req.body.applicantname;
		var effectiveDate = req.body.effectiveDate;
		if (applicantname) {
			condition.applicantname = new RegExp(applicantname);
		}
		if (effectiveDate) {
			condition.effectiveDate = {"$gte":new Date(effectiveDate),"$lte":new Date(effectiveDate)};
		}
		
		Contract.paginate(condition, page, 5, function(err, pageCount, policys) {
			if (err) {
				return next(err);
			}
			var model = {
				policys: policys,
				page: page,
				pageCount: pageCount,
				applicantname: applicantname,
				effectiveDate: effectiveDate
			};
			res.render('website/center/policy-manage', model);
		}, {
			sortBy: {_id: '-1'}
		});		
	});

	//续保提醒
	app.get('/notice', function(req, res) {

		var page = 1;
		var condition = {};
		if(req.query.page){
			page = req.query.page;
		}
		var expirationTime = req.query.expirationTime;
		var startDate = moment().format('YYYY-MM-DD');
        var endDate = moment().add('months',expirationTime).format('YYYY-MM-DD');        
		condition.expiryDate = {"$gte":new Date(startDate),"$lte":new Date(endDate)};
		console.log(condition);

		Contract.paginate(condition, page, 5, function(err, pageCount, policys) {
			if (err) {
				return next(err);
			}
			var model = {
				policys: policys,
				page: page,
				pageCount: pageCount,
				expirationTime: expirationTime
			};
			res.render('website/center/notice', model);
		}, {
			sortBy: {_id: '-1'}
		});
	});

	//续保提醒
	app.post('/notice', function(req, res) {

		var page = 1;
		var condition = {};
		if(req.query.page){
			page = req.query.page;
		}
		var expirationTime = req.body.expirationTime;
		var startDate = moment().format('YYYY-MM-DD');
        var endDate = moment().add('months',expirationTime).format('YYYY-MM-DD');        
		condition.expiryDate = {"$gte":new Date(startDate),"$lte":new Date(endDate)};
		console.log(condition);

		Contract.paginate(condition, page, 5, function(err, pageCount, policys) {
			if (err) {
				return next(err);
			}
			var model = {
				policys: policys,
				page: page,
				pageCount: pageCount,
				expirationTime: expirationTime
			};
			res.render('website/center/notice', model);
		}, {
			sortBy: {_id: '-1'}
		});
	});

	//车险报价
	app.get('/car-quotation', function(req, res) {
		res.render('website/center/car-quotation', {});
	});

	//个人信息管理
	app.get('/member-info', function(req, res) {
		res.render('website/center/member-info', {});
	});

	//保险公司信息查询
	app.get('/companyinfo', function(req, res) {
		res.render('website/center/companyinfo', {});
	});

	//我的计划书
	app.get('/my-list', function(req, res) {
		res.render('website/center/my-list', {});
	});

}