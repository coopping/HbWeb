'use strict';

var mongoose = require('mongoose');
var updatedtimestamp = require('mongoose-updated_at');
var validator = require('../lib/validator');

/**
*积分对象
*/
var integralSchema = new mongoose.Schema({
	userID:{
		type:String,//用户ID
		required:true
	},
	intValue:{
		type:Number,//积分值
		default:0
	}
});

//添加 create,update字段
integralSchema.plugin(updatedtimestamp);

module.exports = mongoose.model('Integral',integralSchema);