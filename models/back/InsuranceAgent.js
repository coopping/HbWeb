'use strict';

var mongoose = require('mongoose');
var updatedtimestamp = require('mongoose-updated_at');
var validator = require('../../lib/validator');

/**************废弃***************/
var agentSchema = new mongoose.Schema({
	agentNname:{
		type:String,//代理人名称
		required:true
	},	
	grade:{
		type:String //评级
	},
	company:{
		type:String //所属公司名称
	},	
	experience:{
		type:String //从业经验
	},
	serPhilosophy:{
		type:String //服务理念
	},
	serviceArea:{
		type:String //服务地区
	},
	headerImg:{
		type:String //头像
	},
	entire:{
		type:String //从业年限
	},
	skilled:{
		type:String //业务特长
	},
	intruduction:{
		type:String //自我介绍
	}
	
}, { collection: 'InsuranceAgent' });

//添加 create,update字段
agentSchema.plugin(updatedtimestamp);

module.exports = mongoose.model('InsuranceAgent',agentSchema);
