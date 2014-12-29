/**
 * Created by lbb on 14-11-2.
 */
'use strict';
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var updatedTimestamp = require('mongoose-updated_at');
var marked = require('marked');
var highlight = require('pygmentize-bundled');

/**
*产品(险种)对象
*/
marked.setOptions({
    highlight: function(code, lang, callback) {
        highlight({
            lang: lang,
            format: 'html'
        }, code, function(err, result) {
            if (err) {
                console.log(err);
                return callback(err, 'error code formate');
            }
            callback(err, result.toString());
        });
    },
    tables: true,
    breaks: true
});

var saleProductSchema = new mongoose.Schema({
    providerId               : {type:ObjectId},   //供应商ID
    providerName             : {type:String} ,    //供应商名称
    productAbbr		         : String,            //商品简称
    planRiderType            : String ,           //主付标志
    saleProductType          : String,            //商品类型(产险寿险)
    planAttrType             : {type:String} ,    //保监小类
    planGovType              : {type:String} ,    //保监大类
    productName              : {type:String},     //商品名称
    productCode			     : {type:String},     //商品代码
    sagencyfee               : {type:String},     //代理费开始
    eagencyfee               : {type:String},     //代理费结束
    productType              : {type:String},     //商品类型
    channelType              : [String] ,         //渠道信息
    branchCode               : [String],          //销售机构信息
    branch                   : String  ,          //操作记录人机构信息
    saleWays                 : [String],          //销售方式
    saleStartDate            : Date,              //销售开始日期
    saleEndDate              : Date,              //销售截止日期
    publishDate              : {type:String},
    productStatus		     : {type: String , default : '0' }, //状态
    productCustomer          : [String] ,         //销售对象
    suitableGroup            : [String] ,         //适合人群
    ensureScope              : [String] ,         //保障范围
    productcity              : [String] ,         //销售地区
    content: {
        syntax: String,
        productinfo: {
            type: String,
            wysiwyg: true,
            height: 100
        },
        productitem: {
            type: String,
            wysiwyg: true,
            height: 100
        }
    },
    productimg               : [ObjectId],      //图片路径集合
    productclause            : [ObjectId],      //条款路径集合
    contractway              : String
}, { collection: 'saleproducts' });

saleProductSchema.plugin(updatedTimestamp);

module.exports = mongoose.model('SaleProduct', saleProductSchema); 