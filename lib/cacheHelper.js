'use strict';

var redis = require("redis");
var client = redis.createClient();

var cache = function() {
    return {
        put: function(cacheName, key, value, cb) {
            client.hset(cacheName, key, JSON.stringify(value), cb);
        },
        get: function(cacheName, key, cb) {
            client.hget(cacheName, key, function(err, reply) {
                if (err) {
                    return cb(null);
                }
                return cb(JSON.parse(reply));
            });
        },
        clearCache: function(cache) {
            if (cache) {
                console.log('启动时清空%s的缓存', cache);
                client.del(cache);
            } else {
                client.keys('*', function(err, keys) {
                    if (!err) {
                        for (var i = 0, l = keys.length; i < l; i++) {
                            console.log('key:%s', keys[i]);
                            client.del(keys[i]);
                        }
                    }
                });
            }
        }
    }
}
module.exports = cache();