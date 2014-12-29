"use strict";
var system = require('./baseCode/system');
var PostCategory = require('../models/PostCategory');

var _postCategory = [];

function getData() {
    PostCategory.find().sort('_id').exec(function(err, results) {
        if (!err) {
            _postCategory = JSON.parse(JSON.stringify(results));
        }
    });
}
getData();

exports.reflashCategory = function() {
    _postCategory = [];
    getData();
};

exports.postCategory = function(key) {
    var datas = _postCategory;
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = datas.length; i < l; i++) {
            var o = datas[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return datas;
};

var _status = [{
    "key": "0",
    "value": "在职"
}, {
    "key": "1",
    "value": "离职"
}];

var _sex = [{
    "key": "1",
    "value": "男"
}, {
    "key": "2",
    "value": "女"
}, {
    "key": "3",
    "value": "未知"
}];

var _customerType = [{
    "key": "1",
    "value": "私人"
}, {
    "key": "2",
    "value": "单位"
}];

var _customerTitle = [{
    "key": "1",
    "value": "男"
}, {
    "key": "2",
    "value": "女"
}];

var _customerCommentsType = [{
    "key": "1",
    "value": "一般"
}, {
    "key": "2",
    "value": "其它"
}];

var _customerCommentsReason = [{
    "key": "1",
    "value": "客户信息错误"
}, {
    "key": "2",
    "value": "客户信息变更"
}];

var _expirationTime = [{
    "key": "1",
    "value": "提前一个月"
}, {
    "key": "2",
    "value": "提前两个月"
}, {
    "key": "3",
    "value": "提前三个月"
}];

var _providerTypeBase = [{
    "key": "1",
    "value": "产险"
}, {
    "key": "2",
    "value": "寿险"
}];

var _forWho = [{
    "key": "1",
    "value": "自己"
}, {
    "key": "2",
    "value": "丈夫"
},{
    "key": "3",
    "value": "妻子"
},{
    "key": "4",
    "value": "父亲"
},{
    "key": "5",
    "value": "母亲"
},{
    "key": "6",
    "value": "儿子"
},{
    "key": "7",
    "value": "女儿"
},{
    "key": "8",
    "value": "其他"
}];

exports.customerCommentsReason = function(key) {
    return getBaseCodes(key, _customerCommentsReason);
}

exports.customerCommentsType = function(key) {
    return getBaseCodes(key, _customerCommentsType);
}

exports.customerTitle = function(key) {
    return getBaseCodes(key, _customerTitle);
}

exports.customerType = function(key) {
    return getBaseCodes(key, _customerType);
}

exports.sex = function(key) {
    return getBaseCodes(key, _sex);
}

exports.statuses = function(key) {
    return getBaseCodes(key, _status);
}

exports.expirationTime = function(key) {
    return getBaseCodes(key, _expirationTime);
}

exports.providerType = function(key) {
    return getBaseCodes(key, _providerTypeBase);
}

exports.forWho = function(key) {
    return getBaseCodes(key, _forWho);
}

function getBaseCodes(key, arrays) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = arrays.length; i < l; i++) {
            var o = arrays[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return arrays;
}


exports.userType = system.userType;
exports.branchLevel = system.branchLevel;
exports.branchType = system.branchType;
exports.branchTypeLevel = system.branchTypeLevel;
exports.valid = system.valid;
exports.menuLevel = system.menuLevel;
exports.postState = system.postState;