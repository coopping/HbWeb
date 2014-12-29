"use strict";
var mongoose = require('mongoose');
var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Error = mongoose.Error;

var authorizationCodeSchema = new mongoose.Schema({
    code: {
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
    redirectURI: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'authorizationCodes'
});

//添加create、update字段
authorizationCodeSchema.plugin(updatedTimestamp);


module.exports = mongoose.model('AuthorizationCode', authorizationCodeSchema);