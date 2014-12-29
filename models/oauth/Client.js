"use strict";
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var validator = require('../../lib/validator');
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;

var clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    clientID: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        unique: true,
        required: true
    },
    redirectURI: {
        type: String,
        unique: true,
        required: true
    },
    scope: {
        type: [String]
    },
    trusted : {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'clients'
});

//添加create、update字段
clientSchema.plugin(updatedTimestamp);
//添加唯一字段校验
clientSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});

module.exports = mongoose.model('Client', clientSchema);