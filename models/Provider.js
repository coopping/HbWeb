//供应商表
"use strict";
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var updatedTimestamp = require('mongoose-updated_at');
var Error = mongoose.Error;
var validator = require('../lib/validator');

var providerSchema = new mongoose.Schema({
    providerName : String,      //名称
    providerAbbr : String,      //简称
    providerCode : String,      //代码
    providerType : String,      //供应商类型
    providerLevel : String,     //供应商级别
    providerStatus : String,      //供应商状态
    country : String,
    city : String,
    clientTel : String,         //客户服务电话
    officialURL :String,        // 官方网站地址
    contractURL : String,       // 保单查询网址
    wechat : String,            //微信号
    lxRen:String,               //联系人
    telephone:String,           //
    mobilePhone:String,         //电话
    address:String             //地址
}, { collection: 'provider' });

providerSchema.plugin(updatedTimestamp);


module.exports = mongoose.model('Provider', providerSchema);