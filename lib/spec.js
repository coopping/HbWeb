'use strict';

var passport = require('passport');
var auth = require('../lib/auth');
var User = require('../models/system/User');
var db = require('../lib/database');
var specialization = require('../lib/middlewear/specialization');
var showMenuMiddleware = require('../lib/middlewear/showMenu');
var errorMessages = require('../lib/middlewear/errorMessages');
var menuHelper = require('../lib/menuHelper');
var vehicleBase = require('../lib/baseCode/vehicleBase');
var branchHelper = require('../lib/branchHelper');
var cronJob = require('../lib/cronJob');

var restClient = require('../lib/restClient/restClient');
var logger = require('../lib/logger');
require('../lib/helper-dateFormat');
require('../lib/helper-baseCode');
require('../lib/helper-security');
require('../lib/helper-selector');


module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
        passport.use('local-signup', auth.localSignup());
        passport.use('local-login', auth.localStrategy());
        //passport.use('oauth2', auth.oauth2());
        // used to serialize the user for the session
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
        // used to deserialize the user
        passport.deserializeUser(function(id, done) {
            User.findById(id).populate('userInfo').exec(function(err,user){
                done(err, user);
            });            
        });
        app.use(passport.initialize());
        app.use(passport.session());
    });
    app.on('middleware:before:router', function configAfterRouter(eventargs) {
        menuHelper.refresh();
        branchHelper.refresh();
        app.use(specialization());
        app.use(auth.injectUser()); //Inject the authenticated user into the response context
        app.use(showMenuMiddleware()); //用于确定该显示什么菜单
        
    });
    app.on('middleware:after:router', function configAfterRouter(eventargs) {
        app.use(errorMessages());
    });
    return {
        onconfig: function(config, next) {
            //初始化数据库连接
            var dbConfig = config.get('databaseConfig');
            db.config(dbConfig);
            //初始化oauth server
            //var oauthConfig = config.get('oauthConfig');
            //oauthServer.config(oauthConfig);
            
            //初始化定时任务
            var cronConfig = config.get('cronConfig');
            cronJob.config(cronConfig);

            //初始化rest Client
            restClient.config(config.get('restUrl'));
            logger.init(config.get('loggerLevel'));
            
            next(null, config);
        }
    };

};