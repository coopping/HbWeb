/**
 * Created by thinkpad on 14-6-24.
 */
"use strict";
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../lib/validator');
var Error = mongoose.Error;

/**
*保险代理人对象
*/
var AgentBrokerSchema =new mongoose.Schema({
    //基本信息：
    agentType            :      {type:String,required:true},     //代理人类型：（专业，电销，网销，银保，团多）
    agentName            : 	 {type:String,required:true},     //姓名：
    agentCode            :      {type:String,required:true},     //工号（后台自动生成）
    education            :      {type:String},                    //学历：
    idType               :       {type:String},                    //证件类型：
    idNo                 :       {type:String,required:true},     //证件号码：
    sex                  :       {type:String},                    //性别：
    birthday             :      {type:Date},                      //出生日期：
    contractMobile       :     {type:String,required:true},     //手机号码：
    telephone            :      {type:String},                    //联系电话：
    address              :      {type:String},                    //联系地址：
    email                :       {type:String},                    //电子邮箱：
    signingTime          :      {type:Number,default:1},         //签约次数：

    //组织信息：
    branchCode          :     {type:String},     //机构
    agentLevel          :     {type:String,required:true},//入司职级：(NC,AM,UM,OM)
    signingDate         :     {type:Date},      //入司日期：
    agentStatus         :     {type:String},    //状态：（离职，在职）
    //证书信息：
    certificateNo      :         {type:String}, //证书号：
    qualification      :         {type:String}, //保险代理资格证号
    startDate          :         {type:Date},   //生效日期：
    endDate            :         {type:Date},   //截止日期：

    //其他字段：
    quitDate            :          {type:Date},//离职日期：
    promotionDate      :          {type:Date},//晋升日期：
    CancellingDate     :          {type:Date},//解约日期：
    
    //web网站维护属性
    grade              :          {type:String },//评级
    companyName        :          {type:String },//所属机构名称
    experience         :          {type:String},//从业经验
    serPhilosophy      :          {type:String},//服务理念
    serRegion          :          {type:String},//服务地区
    createTime         :          {type:Date,default:Date.now}, //创建时间
    createBy           :          {type:String},                //创建用户ID
    updateTime         :          {type:Date,default:Date.now}, //更新时间
    updateBy           :          {type:String}                 //更新用户ID
},{ collection: 'agentbroker' });

AgentBrokerSchema.plugin(updatedTimestamp);


module.exports = mongoose.model('AgentBroker', AgentBrokerSchema);