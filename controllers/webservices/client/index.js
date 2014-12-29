'use strict';


var Logger = require('../../../lib/logger');
var Job = require('../../../controllers/webservices/job/task');

var _ = require('underscore');
var util = require('util');


module.exports = function(app) {

    //代理人
    app.get('/agent', function(req, res, next) {
        Job.agentInfo(res);
        res.render('index', null);
    });

    //产品
    app.get('/productInfo', function(req, res, next) {
        Job.productInfo(res);
        res.render('index', null);
    });

    //保单
    app.get('/contractInfo', function(req, res, next) {
        Job.contractInfo(res);
        res.render('index', null);
    });

    //供应商信息
    app.get('/providerInfo', function(req, res, next) {
        Job.providerInfo(res);
        res.render('index', null);
    });


}