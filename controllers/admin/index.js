'use strict';

var passport = require('passport');
var auth = require('../../lib/auth');
var Post = require('../../models/Post');

module.exports = function(app) {

    app.get('/',auth.isAuthenticated(), function(req, res) {    
        var page = 1;
        if(req.query.page){
        	page = req.query.page;
        }

        var condition = {state : '2'};

        Post.paginate(condition,page,5,function(err,pageCount,posts){
        	if(err){
        		next(err);
        	}

        	var model = {};
        	model.posts = posts;
        	model.page = page;
        	model.pageCount = pageCount;
        	model.title = '天安财险';
        	res.render('admin/index',model);
        },{
        	sortBy:{
        		isTop:-1,
        		publishedAt:-1
        	}
        });
        
    });

    app.get('/login',function(req,res){
    	res.render('admin/login',{title:'请登录',message:req.flash('error')});
    });

    app.post('/login',function(req,res){
    	passport.authenticate('local-login',{
    		successRedirect:req.session.goingTo || '/admin',
    		failureRedirect:'/admin/login',
    		failureFlash:true
    	})(req,res);
    });

    app.get('/logout', auth.isAuthenticated(), function(req, res) {
    	req.logout();
    	req.session.roleMenuTree = null;
    	var redirect = req.query.redirect;
    	if(redirect){
    		res.redirect(redirect);
    	}else{
    		res.redirect('/admin');
    	}
    });

    app.get('/theme/:theme',auth.isAuthenticated(),function(req,res){
    	req.session.theme = req.params.theme;
    	res.redirect('/admin');
    });



    //上传文件      
    app.post('/upload', auth.isAuthenticated(), function(req, res) {
        var files = req.files;
        var model = {
            message: '上载成功！',
            messageType: 'OK'
        };
        if (files && files.uploadFile) {
            var fileName = files.uploadFile.name;
            var option = {
                encoding: 'utf8'
            };
            var stream = fs.createReadStream(files.uploadFile.path);
            var datas = [];
            var i = fileName.lastIndexOf('.');
            if (fileName.substr(i) != '.csv') {
                model.message = '请选择.csv文件！';
                model.messageType = 'warning';
                res.render('finance/preCheck/index', model);
            } else {
                var content = req.body;
                var branch = req.user.branch;
                content.branch = branch;
                content.providerId = new ObjectId(content.providerId);
                content.fileName = fileName;
                var redueUploadModel = new RedueUpload(content);
                var pm = 0;
                var af = 0;
                redueUploadModel.save(function(err, redue) {
                    if (err) {
                        return next(err);
                    }
                    var csvStream = csv({
                            headers: true
                        })
                        .on("data", function(data) {
                            data.redueUploadId = new ObjectId(redue._id);
                            data.branch = branch;
                            data.providerId = new ObjectId(content.providerId);
                            data.bizYearMonth = content.bizYearMonth;
                            datas.push(data);
                            //有可能有数据校验
                        })
                        .on("end", function() {
                            var index = 0;
                            async.eachSeries(datas, function(item, cb) {
                                index++;
                                var redueprevModel = new Redueprev(item);
                                redueprevModel.save(function(err, redueprev) {
                                    if (err) {
                                        cb('第' + (index + 1) + '行数据校验出错：' + err + '，请修改数据并重现上载该行及该行以后的数据');
                                    } else {
                                        pm = new Number(redueprev.modalPrem) + pm;
                                        af = new Number(redueprev.agencyfee) + af;
                                        cb();
                                    }
                                });
                            }, function(err) {
                                RedueUpload.findByIdAndUpdate(redue._id, {
                                    $set: {
                                        modalPrem: pm,
                                        agencyfee: af
                                    }
                                }, function(err) {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.redirect('/finance/preCheck');
                                });
                            });
                        });
                    stream.pipe(iconv.decodeStream('gb2312')).pipe(csvStream);
                });
            }
        } else {
            model.message = '请选择文件！';
            model.messageType = 'warning';
            res.render('finance/preCheck/index', model);
        }
    });

};