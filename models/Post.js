"use strict";
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../lib/validator');
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;

var postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    isTop: {
        type: Boolean,
        default: false
    },
    state: {
        type: String,
        default: '1'
    },
    oprUser: String,
    publishedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'posts'
});

//添加create、update字段
postSchema.plugin(updatedTimestamp);
//添加唯一字段校验
postSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});

postSchema.pre('validate', function(next) {
    var self = this;

    if (self.state === '2' && !self.publishedDate) {
        self.publishedAt = new Date();
    }

    //Continue with the save operation
    next();
});
module.exports = mongoose.model('Post', postSchema);