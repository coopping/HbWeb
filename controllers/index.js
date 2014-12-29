'use strict';


var passport = require('passport');
var auth = require('../lib/auth');
var User = require('../models/system/User');
var UserInfo = require('../models/UserInfo');


module.exports = function(app) {

    app.get('/', function(req, res) {        
        res.render('index',{});        
    });

    app.get('/index', function(req, res) {        
        res.render('index',{});        
    });

    app.get('/login', function(req, res) {    
        res.render('website/login',{});
        
    });

    app.get('/register', function(req, res) {    
        res.render('website/register',{});
        
    });

    app.post('/register',function(req,res){
        var username = req.body.username;
        var password = req.body.password;

        var users ={};
        users.name=username;
        users.password=password;
        var userModel = new User(users);
        userModel.save(function(err,user){
            if(err){
                res.locals.err = err;
                res.locals.view = '/register';
            }

            users.name = user.name;
            users.user = user._id;
            var userInfoModel = new UserInfo(users);
            userInfoModel.save(function(err,userInfo){
                console.log(err);
                if(err){
                    //回滚
                    user.remove(function(err) {
                        if (err) {
                            return next(err);
                        }
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
                });
                
            });

            //$.get("/system/auth/users/" + id + "/signup/resetPass?" + new Date().getTime(), function(data, status) { 

            //});
            req.flash('showMessage', '注册成功');
            res.redirect('/');
        });

    });

    app.get('/consultation', function(req, res) {    
        res.render('website/consultation/consultation',{});        
    });

    app.get('/consultation-detail', function(req, res) {    
        res.render('website/consultation/consultation-detail',{});   
        //res.render('website/consultation/test',{});        
    });
    

    //热销产品
    app.get('/hot-product',function(req,res){
        res.render('website/product/hot-product',{});
    });

    app.get('/product-detail',function(req,res){
        res.render('website/product/product-detail',{});
    });


    //保单测评
    app.get('/insurance',function(req,res){
        res.render('website/insurance/insurance',{});
    });

    app.post('/insurance',function(req,res){

        var forWho = req.body.forWho;
        var optionsRadios = req.body.optionsRadios;
        var year = req.body.year;
        var month = req.body.month;
        var telephone = req.body.telephone;

        console.log(forWho+"="+optionsRadios+"="+year+"="+month+"="+telephone);

        res.render('website/insurance/insurance',{});
    });

    app.get('/insurance-1',function(req,res){
        res.render('website/insurance/insurance-1',{});
    });

    app.get('/insurance-2',function(req,res){
        res.render('website/insurance/insurance-2',{});
    });

    app.get('/insurance-3',function(req,res){
        res.render('website/insurance/insurance-3',{});
    });


    //保单评估
    app.get('/policy',function(req,res){
        res.render('website/policy/policy',{});
    });

    app.get('/policy-1',function(req,res){
        res.render('website/policy/policy-1',{});
    });

    app.get('/policy-2',function(req,res){
        res.render('website/policy/policy-2',{});
    });
    
    


};