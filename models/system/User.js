"use strict";
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
var updatedTimestamp = require('mongoose-updated_at');
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    fullName: String,
    roles: {
        type: [String],
        default: ['ROLE_USER']
    },
    userInfo: {
        type: ObjectId,
        ref: 'UserInfo'
    },
    branch: {
        type: String
    },
    userType: {
        type: String,
        default: '1'
    },
    isValid: {
        type: String,
        default: '1'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//添加create、update字段
userSchema.plugin(updatedTimestamp);
//添加唯一字段校验
userSchema.plugin(uniqueValidator, {
    message: '出错拉, {PATH}不能同已有值重复'
});
/**
 * Helper function that hooks into the 'save' method, and replaces plaintext passwords with a hashed version.
 */
userSchema.pre('save', function(next) {
    var user = this;
    
    if (user.oprBranches && user.oprBranches.length == 0 && user.branch) {
        user.oprBranches.push(user.branch);
    }
    if (user.branch === 'ALL') {
        user.oprBranches = ['ALL'];
    }
    if (user.roles.indexOf('ROLE_USER') < 0) {
        user.roles.push('ROLE_USER');
    }
    
    //If the password has not been modified in this save operation, leave it alone (So we don't double hash it)
    if (!user.isModified('password')) {
        next();
        return;
    }
    //Retrieve the desired difficulty from the configuration. (Default = 8)
    var DIFFICULTY =  8;

    //Encrypt it using bCrypt. Using the Sync method instead of Async to keep the code simple.
    var hashedPwd = bcrypt.hashSync(user.password, DIFFICULTY);

    //Replace the plaintext pw with the Hash+Salted pw;
    user.password = hashedPwd;

    //Continue with the save operation
    next();
});
// checking if password is valid
userSchema.methods.validPassword = function(plainText) {
    return bcrypt.compareSync(plainText, this.password);
};
userSchema.methods.textPassword = function(password) {
    return bcrypt.compareSync(plainText, this.password);
};
module.exports = mongoose.model('User', userSchema);