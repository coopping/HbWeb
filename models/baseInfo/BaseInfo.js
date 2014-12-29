"use strict";
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var baseInfoSchema = new mongoose.Schema({
    code: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    values: [{
        key: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        startDate: Date,
        endDate: Date
    }],
    brand: String
}, {
    collection: 'base_baseInfo'
});


//添加唯一字段校验
baseInfoSchema.plugin(uniqueValidator, {
    message: '出错拉, 基本信息类型不能同已有值重复'
});
// displacementSchema.pre('validate', function(next) {
//     var self = this;
//     self.key = self.value;

//     //Continue with the save operation
//     next();
// });

module.exports = mongoose.model('Base_baseInfo', baseInfoSchema);