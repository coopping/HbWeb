'use strict';

var mongoose = require('mongoose');
var updatedtimestamp = require('mongoose-updated_at');
var validator = require('../lib/validator');

/**
*评论信息对象
*/
var commentSchema = new mongoose.Schema({
	agentID:{
		type:String //评论的主体(代理人ID)
	},
	content:{
		type:String //评论内容
	},
	authorIP:{
		type:String //评论者IP
	},
	deleteFlag:{
		type:String //删除标志
	},
	reviewTime:{
		type:Date,//评论时间
		default:Date.now
	},
	userID:{
		type:String //评论者用户ID（不一定存在）
	},
	userName:{
		type:String //如果有注册，则是注册用户，没有注册，匿名用户
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

//添加 create,update字段
commentSchema.plugin(updatedtimestamp);

module.exports = mongoose.model('Comment',commentSchema);



