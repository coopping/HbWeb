"use strict";
var Branch = require('../models/system/Branch');
var cache = require('../lib/cacheHelper');

var counts = {};

var branchTree = function() {

    counts.branchTree = [];
    console.log('初始化机构树');
    Branch.find({
        parent: 'top',
        levelId: '0'
    }).
    //sort('sortKey').
    exec(
        function(err, branches) {
            //counts.counter = 1;
            counts.counter = 0;
            branches.forEach(function(branch) {
                counts.counter++;
                var info = {};
                info.code = branch.code;
                info.name = branch.name;
                info.children = []
                getChildren(info, function(err, branch) {
                    if (err) {
                        return console.log('err:%s', err);
                    }
                    counts.branchTree.push(branch);
                    counts.branchTree.sort(function(a, b) {
                        return a.code - b.code;
                    });
                });
                //counts.counter--;
            });
        });
}

function getChildren(info, cb) {
    Branch.find({
        parent: info.code
    }, function(err, branches) {
        if (err) {
            return cb(err);
        }
        branches.forEach(function(branche) {
            counts.counter++;
            var b = {};
            b.code = branche.code;
            b.name = branche.name;
            b.children = [];
            getChildren(b, function(err, b1) {
                info.children.push(b1);
                info.children.sort(function(a, b) {
                    return a.code - b.code;
                });
            });
        });
        counts.counter--;
        cb(null, info);
        if (counts.counter == 0) {
            cache.put('Branche', 'branchTree', counts.branchTree, function(err, result) {
                if (err) {
                    console.log('机构树放入缓存出错');
                } else {
                    delete counts.branchTree;
                    delete counts.counter;
                }
            });
        }
    })
}

exports.branchTree = function(cb) {
    cache.get('Branche', 'branchTree', function(reply) {
        if (!reply) {
            branchTree();
            cache.get('Branche', 'branchTree', function(reply) {
                cb(reply);
            })
        } else {
            cb(reply);
        }
    });
};

exports.refresh = function() {
    cache.clearCache('Branche');
    branchTree();
};

function _getUserOprBranches(oprBranches, branch) {
    var node = {};
    node.id = branch.code;
    node.text = branch.name;
    node.children = [];
    node.state = {
        opened: false
    };
    if (oprBranches.indexOf(branch.code) >= 0 || oprBranches.indexOf('ALL') >= 0) {
        node.state.selected = true;
    }
    for (var i = 0, l = branch.children.length; i < l; i++) {
        node.children.push(_getUserOprBranches(oprBranches, branch.children[i]));
    }
    return node;
}


exports.getUserOprBranches = function(user, oprBranches, branchTree) {
    var userBranches = [];
    var currentUerOprBranches = user.oprBranches;
    console.log(oprBranches);
    branchTree.forEach(function(branch) {

        if (currentUerOprBranches.indexOf(branch.code) >= 0 || currentUerOprBranches.indexOf('ALL') >= 0) {
            userBranches.push(_getUserOprBranches(oprBranches, branch));
        }
    });
    return userBranches;
};

function getOprBranches(branches) {
    var result = [];
    if (typeof branches === 'string') {
        branches = [branches];
    }
    for (var i = 0, l = branches.length; i < l; i++) {
        var tempb = branches[i]
        var dropFlag = 0;
        for (var ii = 0, ll = result.length; ii < ll; ii++) {
            var tempR = result[ii];
            //son of result
            if (tempb.indexOf(tempR) == 0) {
                dropFlag = 1;
                break;
            } else if (tempR.indexOf(tempb) == 0) { //ancestor of result
                result[ii] = tempb;
                dropFlag = 1;
            }
        }
        if (dropFlag == 0) {
            result.push(tempb);
        }
        dropFlag = 0;
    }
    result.sort();
    var uniqueResult = [];
    for (var i = 0; i < result.length; i++) {
        var tempb = result[i];
        if (result[i] == uniqueResult[uniqueResult.length - 1]) {
            continue;
        }
        uniqueResult.push(tempb);
    }
    return uniqueResult;
}
exports.getOprBranches = getOprBranches;