"use strict";
var auth = require('../../../lib/auth');
var baseCode = require('../../../lib/baseCode');
var Post = require('../../../models/Post');
var PostCategory = require('../../../models/PostCategory');
var _ = require("underscore");
var async = require('async');


var util = require('util');

module.exports = function(router) {

	router.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res) {
	    res.redirect('/admin/information/release');
	});

    router.get('/release', auth.isAuthenticated('ROLE_ADMIN'), function(req, res,next) {
        
        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        var condition = {};
        if (req.query.condition) {
            condition = req.query.condition;
        }
        var model = {
            showMessage: req.flash('showMessage')
        };
        model.condition = condition;

        var realCondition = {};
        for (var o in condition) {
            if (!condition[o] || condition[o] === 'undefined') {
                delete condition[o];
            } else {
                if (o === 'title') {
                    var reg = new RegExp(condition[o], 'i');
                    realCondition[o] = reg;
                } else {
                    realCondition[o] = condition[o];
                }
            }
        }

        Post.paginate(realCondition, page, 10, function(err, pageCount, posts) {
            if (err) {
                return next(err);
            }

            model.posts = posts;
            model.page = page;
            model.pageCount = pageCount;
            
            res.render('admin/information/index', model);
        }, {
            sortBy: {
                isTop: 1,
                publishedAt: -1,
            }
        });
    });

    router.post('/new', auth.isAuthenticated('ROLE_ADMIN'), function(req, res,next) {
        var post = req.body.post;

        var postModel = new Post(post);
        postModel.oprUser = req.user.name;
        postModel.save(function(err) {
            if (err) {
                return next(err);
            }
            req.flash('showMessage', '创建成功');
            res.redirect('/admin/information/');
        });
    });

    router.get('/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res) {
        var id = req.params.id;
        Post.findById(id, function(err, post) {
            if (err) {
                return next(err);
            }
            var model = {
                message: 'OK'
            };
            model.post = post;
            res.json(model);
        });
    });
    router.post('/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res,next) {
        var id = req.params.id;
        var postInput = req.body.post;
        Post.findByIdAndUpdate(id, postInput, function(err) {
            if (err) {
                return next(err);
            }
            req.flash('showMessage', '修改成功');
            res.redirect('/admin/information/');
        })
    });

    router.get('/:id/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res,next) {
        var id = req.params.id;
        Post.findByIdAndRemove(id, function(err, post) {
            if (err) {
                return next(err);
            }
            var model = {
                message: 'OK'
            };
            res.json(model);
        });
    });

    router.get('/category', auth.isAuthenticated('ROLE_ADMIN'), function(req, res) {
        var locals = res.locals;
        locals.section = 'posts';
        locals.subSection = 'post-cates';

        var page = req.query.page;
        var condition = {};

        async.parallel([
            //查询cates信息
            function(cb) {
                PostCategory.paginate(condition, page || 1, 10, function(err, pageCount, cates) {
                    cb(err, {
                        pageCount: pageCount,
                        result: cates
                    });
                });
            },
            //查询总数
            function(cb) {
                PostCategory.count(condition, function(err, count) {
                    cb(err, count);
                });
            }
        ], function(err, results) {
            if (err) {
                return next(err);
            }
            var model = {
                title: '分类列表',
                cates: results[0].result,
                page: page || 1,
                pageCount: results[0].pageCount,
                count: results[1]
            };
            res.render('admin/information/category', model);
        });
    });

	router.post('/category/create', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        var locals = res.locals;
        locals.section = 'posts';
        locals.subSection = 'post-cates';

        var value = req.body.value;
        var postCategory = new PostCategory();
        postCategory.value = value;

        postCategory.save(function(err) {
            if (err) {
                return next(err);
            }
            req.flash('success', {
                title: '创建成功'
            });
            baseCode.reflashCategory();
            res.redirect('/admin/information/category');
        });
    });

    router.get('/category/:id/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res,next) {
        var id = req.params.id;
        PostCategory.findByIdAndRemove(id, function(err, post) {
            if (err) {
                return next(err);
            }
            var model = {
                message: 'OK'
            };
            res.json(model);
        });
    });
};