"use strict";
// var BranchLevel = require('../../models/base/BranchLevel'),
//     BranchType = require('../../models/base/BranchType'),
//     BranchTypeLevel = require('../../models/base/BranchTypeLevel');

var _branchLevel = [{
    "key": "0",
    "value": "总公司"
}, {
    "key": "1",
    "value": "一级"
}, {
    "key": "2",
    "value": "二级"
}, {
    "key": "3",
    "value": "三级"
}, {
    "key": "4",
    "value": "四级"
}]; //定义缓存信息的对象

//通过find获取对应的基表信息
//BranchLevel.find().sort('_id').exec(function(err, results) {
//  if (!err) {
//      _branchLevel = JSON.parse(JSON.stringify(results));
//  }
//});


var _branchType = [{
    "key": "1",
    "value": "主机厂"
}, {
    "key": "2",
    "value": "保险公司"
}];
// BranchType.find().sort('_id').exec(function(err, results) {
//     if (!err) {
//         _branchType = JSON.parse(JSON.stringify(results));
//     }
// });

var _branchTypeLevel = [{
    "key": "1",
    "value": "A类机构"
}, {
    "key": "2",
    "value": "B类机构"
},{
    "key": "3",
    "value": "C类机构"
}];
// BranchTypeLevel.find().sort('_id').exec(function(err, results) {
//     if (!err) {
//         _branchTypeLevel = JSON.parse(JSON.stringify(results));
//     }
// });

var _validBase = [{
    "key": "1",
    "value": "是"
}, {
    "key": "0",
    "value": "否"
}];

var _menuLevelBase = [{
    "key": "1",
    "value": "一级菜单"
}, {
    "key": "2",
    "value": "二级菜单"
}, {
    "key": "3",
    "value": "三级菜单"
}];

var _postState = [{
    "key": "1",
    "value": "草稿"
}, {
    "key": "2",
    "value": "已发布"
}, {
    "key": "3",
    "value": "归档"
}];
exports.postState = function(key) {
    var datas = _postState;
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



//将获取方法导出
exports.branchLevel = function(key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _branchLevel.length; i < l; i++) {
            var o = _branchLevel[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _branchLevel;
};
exports.branchType = function(key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _branchType.length; i < l; i++) {
            var o = _branchType[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _branchType;
};
exports.branchTypeLevel = function(key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _branchTypeLevel.length; i < l; i++) {
            var o = _branchTypeLevel[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _branchTypeLevel;
};

exports.valid = function(key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _validBase.length; i < l; i++) {
            var o = _validBase[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _validBase;
};

exports.menuLevel = function(key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _menuLevelBase.length; i < l; i++) {
            var o = _menuLevelBase[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _menuLevelBase;
};


var _userType = [{
    "key": "1",
    "value": "经销商用户"
}, {
    "key": "2",
    "value": "保险公司内勤"
}];

exports.userType = function(key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _userType.length; i < l; i++) {
            var o = _userType[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _userType;
};