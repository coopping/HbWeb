"use strict";
var cache = require('../../lib/cacheHelper');
var Base_baseInfo = require('../../models/baseInfo/BaseInfo');
var async = require('async');
var _ = require("underscore");

exports.baseInfo = function(key, code, brand, cb) {
    cache.get('baseInfo', brand, function(result) {
        if (result && result.length > 0) {
            var info = _.find(result, function(item) {
                return item.code === code;
            });
            if (key) {
                var d = _.find(info.values, function(o) {
                    return o.key === key;
                });
                return cb(null, [d]);
            } else {
                return cb(null, info.values);
            }
        } else {
            Base_baseInfo.find({
                brand: brand
            }).sort('code').exec(function(err, infos) {
                if (err) {
                    return callback(err);
                }
                cache.put('baseInfo', brand, infos, function() {
                    var info = _.find(infos, function(item) {
                        return item.code === code;
                    });
                    if (key) {
                        var d = _.find(info.values, function(o) {
                            return o.key === key;
                        });
                        return cb(err, [d]);
                    } else {
                        return cb(err, info.values);
                    }
                });
            });
        }
    });
};