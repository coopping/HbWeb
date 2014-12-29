/**
 * Created by lbb on 14-11-2.
 */
var mongoose = require("mongoose");
var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;
var validator = require('../lib/validator');
var Error = mongoose.Error;


var CoverageSchema =new mongoose.Schema({  //保单险种信息
    createDate      :   {type:Date,default:Date.now()}, //  创建日期
    createUserId    :   {type:ObjectId},                // 创建人
    updateDate      :   {type:Date,default:Date.now()}, //  修改日期
    updateUserId    :   {type:ObjectId},                //  修改人
    contractNo      :   {type:String},                   //  保单号码
    contractId      :   {type:ObjectId},                //  保单id
    providerId      :   {type:ObjectId,ref:"Provider"}, // 供应商id
    productId       :   {type:ObjectId,ref:'Product'},  //  产品id
    productName     :   {type:String},                   //   产品名称
    channelType     :   {type:String},                  //   渠道类型
    contractStatus  :   {type:String},                  //  保单状态
    effectiveDate   :   {type:Date},                    //   生效日期
    approveDate     :   {type:Date},                   //   承保日期
    paydueDate      :   {type:Date},     
    premiumMode     :   {type:String},                 //   缴别
    premiumPeriod   :   {type:String},                 //   年期
    faceaMout       :   {type:Number},                 //   保额
    totalModalPrem  :   {type:Number},                 //   保费
    agencyfee       :   {type:Number},                 //   代理费
    valuePrem       :   {type:Number},                 //   价保
    commisstionPrem :   {type:Number}                  //   佣金
});

var ContractSchema = new mongoose.Schema({  //保单信息
    createDate              :   {type: Date, default: Date.now()},  //
    createUserId            :   {type: ObjectId},//
    updateDate              :   {type: Date, default: Date.now()},//
    updateUserId            :   {type: ObjectId},//
    contractNo              :   {type: String},// 保单号码
    applicationNo           :   {type: String},//投保单号
    providerId              :   {type: ObjectId,ref:'Provider'},//
    channelType             :   {type: String},//渠道类型
    branch                  :   {type: String},//业绩归属机构
    contractStatus          :   {type: String},//保单状态
    acceptDate              :   {type: Date},//受理日期
    paidupDate              :   {type: Date},//回单日期
    applyDate               :   {type: Date, default: Date.now()},//录入日期
    effectiveDate           :   {type: Date},//生效日期
    approveDate             :   {type: Date},// 承保日期
    paydueDate              :   {type: Date},// 缴费日期
    policySubmitStatus      :   {type: String,default:'N'},//递交状态
    policySubmitDate        :   {type: Date},// 递交日期
    signDate                :   {type: Date},// 客户签收日期
    returnReceiptAcceptDate :   {type: Date},// 交回日期
    receiptSubmitDate       :   {type: Date},// 回执递交日期
    returnReceiptDate       :   {type: Date},// 回执日期
    expiryDate              :   {type: Date},// 保单到期日
    hesitateEndDate         :   {type: Date},// 犹豫期结束日期
    returnReceiptStatus     :   {type: String,default:'N'},//回执状态
    agentId                 :   {type: ObjectId,ref:'Agentbroker'},// 代理人id
    agentName               :   {type: String},     // 代理人姓名
    agentCode               :   {type: String},     // 代理人代码
    businessType            :   {type:String},      //业务类型(产寿险)
    contractType            :   {type:String}, 
    //保单分类(1(寿险).2(车险).3(短意).4（理财）.6（延保）.5（财产）)
    premiumMode             :   {type: String},// 缴别
    faceaMoutTotle          :   {type: Number},// 保额合计
    totalModalPrem          :   {type: Number},// 保费合计
    initialChargeMode       :   {type: String},// 首期缴费方式
    renewalChargeMode       :   {type: String},// 续期缴费方式
    agencyfee               :   {type: Number},// 代理费合计
    valuePrem               :   {type: Number},// 价保合计
    commissionPrem          :   {type: Number},// 佣金合计
    ascriptionMode          :   {type: String},// 业绩归属
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
    },
    policyVehicle:{ //车辆信息
        vehicleType         :   String,     //车辆种类
        vehicleModel        :   String,     //车辆型号：
        vehicleLicenceNo    :   String,     //车牌号
        engineNo            :   String,     //发动机编号：
        frameNo             :   String,     //车架编号：
        vehicleColor        :   String,     //车身颜色：
        usageType           :   String,     //使用性质
        purchaseDate        :   {type: Date, default: Date.now()},//购置日期：
        madeDate            :   {type: Date, default: Date.now()},//制造年月：
        purchaseinVoiceNo   :   String,     //购车发票号：
        vehicleOwnerName    :   String      //车辆所有者：
    },
   carPre:{     //车辆险种信息
        csi                 :Number,//交强险
        travelTax           :Number,//车船税
        cmi                 :Number,//商业险
        cmiAmount           :Number,//商业险*保额
        TPLAmount           :Number,//三者责任险
        TPLPre              :Number,
        vDamageAmount       :Number,//损失险
        vDamagePre          :Number,
        driverLbAmount      :Number,//车上人员(驾驶员)责任险
        driverLbPre         :Number,
        passengerLbAmount   :Number,//车上人员(乘客)责任险
        passengerLbPre      :Number,
        nDspecialPre        :Number, //不计免赔特约险
        vPilferAmount       :Number,//全车盗抢险
        PilferPre          :Number,
        gBreakagePre        :Number,//玻璃单独破碎险
        sptLossPre          :Number,//自燃损失险
        eDamagePre          :Number,//涉水险/发动机特别损失险
        bScratchAmount      :Number,//身划痕险
        bScratchPre         :Number

    },
    children: [CoverageSchema]
}, { collection: 'contracts' });


ContractSchema.plugin(updatedTimestamp);

module.exports = mongoose.model('Contract', ContractSchema);