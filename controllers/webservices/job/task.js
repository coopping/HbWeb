'use strict';

var Logger = require('../../../lib/logger');
var restClient = require('../../../lib/restClient/restClient');
var restObjUtil = require('../../../lib/restClient/restObjUtil');

var AgentBroker = require('../../../models/AgentBroker');
var Provider = require('../../../models/Provider');
var Contract = require('../../../models/Contract');
var SaleProduct = require('../../../models/SaleProduct');
var Customer = require('../../../models/Customer');
var AccessToken = require('../../../models/oauth/AccessToken');

/**
 *ESB代理人接口调用
 */
exports.agentInfo = function(res) {
	//接口查询参数
	var model = {};
	restClient.agentInfo(model, function(err, obj) {
		if (err) {
			Logger.error(err);
			res.json({
				success: false,
				msg: '调用代理人接口失败' + err
			});
			return;
		}

		var agentLists = obj.agentBroker;
		if (agentLists) {
			agentLists.forEach(function(agent) {
				var AgentBrokerModel = new AgentBroker(agent);
				AgentBrokerModel.save(function(err, agents) {
					if (err) {
						Logger.error(err); //输出错误信息
					}
				});
			});
		}
	});
}

/**
 *ESB产品接口调用
 */
exports.productInfo = function(res) {
	//接口查询参数
	var model = {};
	restClient.saleProductInfo(model, function(err, obj) {
		if (err) {
			Logger.error(err);
			res.json({
				success: false,
				msg: '调用产品接口失败' + err
			});
			return;
		}

		var productLists = obj.saleProduct;
		if (productLists) {
			productLists.forEach(function(product) {
				var SaleProductModel = new SaleProduct(product);
				SaleProductModel.save(function(err, products) {
					if (err) {
						Logger.error(err); //输出错误信息
					}
				});
			});
		}
	});
}

/**
 *ESB保单接口调用
 */
exports.contractInfo = function(res) {
	//接口查询参数
	var model = {};
	restClient.contractInfo(model, function(err, obj) {
		if (err) {
			Logger.error(err);
			res.json({
				success: false,
				msg: '调用保单接口失败' + err
			});
			return;
		}

		var contractLists = obj.contract;
		if (contractLists) {
			contractLists.forEach(function(contract) {
				var ContractModel = new Contract(contract);
				ContractModel.applicantname = contract.applicant.applicantname;

				ContractModel.save(function(err, contractObj) {
					if (err) {
						Logger.error(err); //输出错误信息
					}
					//把保单对象中的数据进行拆分，投保人信息单独存储，方便后期维护
					var tempObj = {};
					tempObj.contractNo = contract.contractNo;
					tempObj.applicationNo = contract.applicationNo;
					tempObj.agentId = contract.agentId;
					tempObj.applicant = contract.applicant;
					tempObj.policy = contract.policy;
					tempObj.beneficiary = contract.beneficiary;

					var CustomerModel = new Customer(tempObj);
					CustomerModel.save(function(err, customerObj) {
						if (err) {
							Logger.error(err); //输出错误信息
						}
					})
				});
			})
		}
	});
}

/**
 *ESB供应商接口调用
 */
exports.providerInfo = function(res) {
	//接口查询参数
	var model = {};
	restClient.providerInfo(model, function(err, obj) {
		if (err) {
			Logger.error(err);
			res.json({
				success: false,
				msg: '调用供应商接口失败' + err
			});
			return;
		}

		var providerLists = obj.providers;
		if (providerLists) {
			providerLists.forEach(function(prov) {
				var ProviderModel = new Provider(prov);
				ProviderModel.save(function(err, providerObj) {
					if (err) {
						Logger.error(err); //输出错误信息
					}
				});
			})
		}
	});
}

/**
 *检查过期的token，并删除之
 */
exports.deleteAccessToken = function() {
	AccessToken.remove({
		expirationDate: {
			$lt: new Date()
		}
	}, function(err) {
		if (err) {
			Logger.error('删除过期access token出错');
		}
	});
}