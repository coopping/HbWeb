"use strict";
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');

var postCategorySchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//添加create、update字段
postCategorySchema.plugin(updatedTimestamp);
//添加唯一字段校验
postCategorySchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});

postCategorySchema.pre('validate', function(next) {
    var self = this;

    self.key = self.id;

    //Continue with the save operation
    next();
});



module.exports = mongoose.model('PostCategory', postCategorySchema);