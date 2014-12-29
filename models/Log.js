'use strict';


var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');

/**
*日志信息
*/
var logSchema = new mongoose.Schema({
	ipAddress:{
		type:String //IP地址
	},
	terminalType:{
		type:String //终端类型
	},
	isRegister:{
		type:String //是否注册用户
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
logSchema.plugin(updatedTimestamp);

module.exprots = mongoose.model('Log',logSchema);
