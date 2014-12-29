'use strict';


var mongoose = require('mongoose');

var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
*用户登录信息
*/
var loginSchema = new mongoose.Schema({	
	loginName:{
		type:String, //用户名
		uniqure:true,
		required:true
	},
	password:{
		type:String //密码
	},	
	loginIP:{
		type:String //登录IP
	},
	loginCount:{
		type:Number //登录次数
	},
	createTime:{
		type:Date,//创建时间
		default:Date.now
	},
	createBy:{
		type:String //创建用户ID
	},
	updateTime:{
		type:Date,//更新时间
		default:Date.now
	},
	updateBy:{
		type:String //更新用户ID
	}
});

//添加create,update字段
loginSchema.plugin(updatedTimestamp);

module.exprots = mongoose.model('LoginInfo',loginSchema);