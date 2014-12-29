'use strict';

/*
*提供微信端菜单访问
*/
module.exports = function(app) {

	/***************************展业利器*******************************/
	//我的产品信息
	app.get('/products',function(req,res){
		//TODO
		console.log('微信访问来了。。。。products');
		res.render('weixin/exhibition/products');
	});

	//车险报价
	app.get('/carQuote',function(req,res){
		//TODO
		console.log('微信访问来了。。。。carQuote');
		res.render('weixin/exhibition/carQuote');
	});

	//寿险计划书
	app.get('/prospectus',function(req,res){
		//TODO
		console.log('微信访问来了。。。。prospectus');
		res.render('weixin/exhibition/prospectus');
	});

	//我的名片
	app.get('/myCard',function(req,res){
		//TODO
		console.log('微信访问来了。。。。myCard');
		res.render('weixin/exhibition/myCard');
	});

	//我的观点
	app.get('/myViewpoint',function(req,res){
		//TODO
		console.log('微信访问来了。。。。myViewpoint');
		res.render('weixin/exhibition/myViewpoint');
	});




	/***************************客户服务*******************************/
	//客户管理
	app.get('/myCustomer',function(req,res){
		//TODO
		console.log('微信访问来了。。。。myCustomer');
		res.render('weixin/custService/myCustomer');
	});

	//续期续保
	app.get('/renewal',function(req,res){
		//TODO
		console.log('微信访问来了。。。。renewal');
		res.render('weixin/custService/renewal');
	});

	//业绩查询
	app.get('/achievement',function(req,res){
		//TODO
		console.log('微信访问来了。。。。achievement');
		res.render('weixin/custService/achievement');
	});

	//客户资讯
	app.get('/information',function(req,res){
		//TODO
		console.log('微信访问来了。。。。information');
		res.render('weixin/custService/information');
	});
	
}


