'use strict';

var mongoose = require("mongoose");
var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
*代理人的客户信息
*/
var CustomerSchema = new mongoose.Schema({
	contractNo              :   {type: String},   // 保单号码
    applicationNo           :   {type: String},   //投保单号
    agentId                 :   {type: ObjectId,ref:'Agentbroker'},// 代理人id
    applicant               :   {   //投保人信息
        aidtype             :   String,
        aidno               :   String,
        applicantname       :   String,
        asex                :   String,
        abirthday           :   Date,
        aemail              :   String,
        contractmobile      :   String,
        telephone           :   String,
        address             :   String
    },
    policy                  : {  //被保人信息
        prelations          :   String,
        pidtype             :   String,
        pidno               :   String,
        insurename          :   String
    },
    beneficiary             : { //受益人信息
        brelations          :   String,
        bidtype             :   String,
        bidno               :   String,
        binsurename         :   String,
        insuretype          :   String
    }
});


CustomerSchema.plugin(updatedTimestamp);

module.exports = mongoose.model('Customer', CustomerSchema);