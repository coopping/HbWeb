"use strict";
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;

var accessTokenSchema = new mongoose.Schema({
    token: {
        type: String
    },
    clientID: {
        type: String
    },
    userID: {
        type: String
    },
    scope : {
        type: [String]
    },
    expires: {
        type: Number
    },
    expirationDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'accessTokens'
});

//添加虚拟字段计算token的过期日期
// accessTokenSchema.virtual('expirationDate').get(function() {
//     return new Date(this.createdAt.getTime() + (this.expires * 1000));
// });
accessTokenSchema.pre('save', function(next) {
    var self = this;
    self.expirationDate = new Date(new Date().getTime() + (self.expires * 1000));
    next();
});
//添加create、update字段
accessTokenSchema.plugin(updatedTimestamp);


module.exports = mongoose.model('AccessToken', accessTokenSchema);