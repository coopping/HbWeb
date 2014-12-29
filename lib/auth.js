/**
 * Module that will handle our authentication tasks
 */
'use strict';

var User = require('../models/system/User');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var menuHelper = require('./menuHelper');
var Client = require('../models/oauth/Client');
var AccessToken = require('../models/oauth/AccessToken');

exports.config = function(config) {
    
};

exports.isAllowedFromMail = function() {

    return function(req, res, next) {
        var id = '';
        var mail = '';
        var code = '';
        if (req.method === 'GET') {
            id = req.query.id;
            mail = req.query.mail;
            code = req.query.code;
        } else if (req.method === 'POST') {
            var id = req.body.id;
            var mail = req.body.mail;
            var code = req.body.code;
        }
        UserInfo.findOne({
            email: mail
        }, function(err, userInfo) {
            if (err) {
                res.status(500);
                res.render('errors/500');
                return;
            }
            SecuURL.findById(id, function(err, url){
                
                if (err) {
                    res.status(500);
                    res.render('errors/500');
                    return;
                }
                if (!url) {
                    res.status(401);
                    res.render('errors/4011');
                    return;
                }
                var name = url.email;
                console.log(bcrypt.compareSync(userInfo.name + mail, code));
                //if (bcrypt.compareSync(userInfo.name + mail, code)){
                    
                    res.locals.mailUserName = userInfo.name;
                    next();
               // }else {
               //     res.status(401);
               //     res.render('errors/4011');
               //     return;
               // }
            })
       })
    };
};

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localStrategy = function() {

    return new LocalStrategy(function(username, password, done) {

        //Retrieve the user from the database by login
        User.findOne({
            'name': username
        }, function(err, user) {

            //If something weird happens, abort.
            if (err) {
                return done(err);
            }

            //If we couldn't find a matching user, flash a message explaining what happened
            if (!user) {
                return done(null, false, {
                    message: '用户不存在'
                });
            }

            //Make sure that the provided password matches what's in the DB.
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Oops! 错误的密码'
                });
            }

            //If everything passes, return the retrieved user object.            
            done(null, user);

        });
    });
};

/**
 * A helper method to retrieve a user from a local DB and ensure that the provided password matches.
 * @param req
 * @param res
 * @param next
 */
exports.localSignup = function() {
    return new LocalStrategy(function(username, password, done) {
        User.findOne({
            'name': username
        }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, {
                    message: '该用户名已经被注册了'
                });
            } else {

                // if there is no user with that email
                // create the user
                var newUser = new User();
                // set the user's local credentials
                newUser.name = username;
                newUser.password = password;
                newUser.roles = ['ROLE_USER'];
                // save the user
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            }
        });
    });

};

exports.basicStrategy = function(){
    return new BasicStrategy(function(username,password,done){
        Client.findOne({
            name:username
        },function(err,client){
            if(err){
                return done(err);
            }
            if(!client){
                return done(null,false);
            }
            if(client.clientSecret != password){
                return done(null,false);
            }
            return done(null,client);
        });
    });
};

exports.clientPasswordStrategy = function(){
    return new ClientPasswordStrategy(function(clientId,clientSecret,done){
        Client.findOne({
            clientID:clientId
        },function(err,client){
            if(err){
                return done(err);
            }
            if(!client){
                return done(null,false);
            }
            if(client.clientSecret != clientSecret){
                return done(null,false);
            }
            return done(null,client);
        });
    });
};

exports.bearerStrategy = function(){
    return new BearerStrategy(function(accessToken,done){
        
        AccessToken.findOne({
            token:accessToken
        },function(err,token){
            if(err){
                return done(err);
            }
            if(!token){
                return done(null,false);
            }
            if (new Date() > token.expirationDate) {
                token.remove(function(err){
                    return done(err);
                });
            }else{
                if(token.userID){
                    User.findById(token.userID).populate('userInfo').
                    exec(function(err){
                        if(err){
                            return done(err);
                        }
                        if(!user){
                            console.error('can not find user by token');
                            return done(null,false);
                        }

                        var info = {
                            scope:token.scope ? token.scope :['*'],
                            client:token.clientID
                        }
                        done(null,user,info);
                    });

                }else{
                    //如果userID为空，直接返回client
                    Client.findById(token,clientID,function(err,client){
                        if(err){
                            return done(err);
                        }
                        if(!client){
                            console.error('can not found client by token');
                            return done(null,false);
                        }

                        var info = {
                            scope:token.scope ? token.scope : '*',
                            client:token.clientID
                        }
                        done(null,client,info);
                    });
                }
            }
        });
    });
};

/**
 * A helper method to determine if a user has been authenticated, and if they have the right role.
 * If the user is not known, redirect to the login page. If the role doesn't match, show a 403 page.
 * @param role The role that a user should have to pass authentication.
 */
exports.isAuthenticated = function(roles) {

    return function(req, res, next) {

        if (!req.isAuthenticated()) {

            //If the user is not authorized, save the location that was being accessed so we can redirect afterwards.
            req.session.goingTo = req.originalUrl;
            res.redirect('/admin/login');
            return;
        }

        //If a role was specified, make sure that the user has it.
        var hasRole = false;
        var user = req.user;
        if (roles) {
            for (var i = 0, l = user.roles.length; i < l; i++) {
                if (roles.indexOf(user.roles[i]) >= 0) {
                    hasRole = true;
                    break;
                }
            }
            if (!hasRole) {
                res.status(401);
                res.render('errors/401');
                return;
            }
        }
        next();
    };
};

/**
 * A helper method to add the user to the response context so we don't have to manually do it.
 * @param req
 * @param res
 * @param next
 */
exports.injectUser = function() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            var user = req.user;
            res.locals.logedInUser = user;
            
            if(req.session.roleMenuTree){
                res.locals.roleMenuTree = req.session.roleMenuTree;
                return next();
            } else {
                    menuHelper.getRoleMenuTree('extension',user.roles,function(err,menuTree){
                    req.session.roleMenuTree = menuTree;
                    res.locals.roleMenuTree = menuTree;
                    return next();
                }); 
            }
        }else{
            return next();
        }
    }
};

exports.branchCondition = function(condition, user, field) {
    var oprBranches = user.oprBranches;
    var branch = user.branch;
    if (oprBranches.indexOf('ALL') >= 0) {
        return;
    }

    var str = oprBranches.toString();
    str = str.replace(/,/g, '|');
    var reg = new RegExp(str, 'i');
    condition[field] = reg;
};