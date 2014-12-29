"use strict";

var extend = require('util')._extend;
var http = require('http');
var BufferHelper = require('bufferhelper');

var _options = {};


var client = function() {
    return {
        config: function(config) {
            _options = config;
        },
        qrCode: function(data, cb) {
            var _data = {
                data: data,
                size: 10
            };
            var dataString = JSON.stringify(_data);
            var option = extend({}, _options);
            option.path = option.path + 'qrcode';
            option.method = 'post';
            option.headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': dataString.length,
                'Accept': 'application/json'
            };
            var req = http.request(option, function(response) {
                var bufferHelper = new BufferHelper();
                response.on('data', function(chunk) {
                    bufferHelper.concat(chunk);
                });
                response.on('end', function() {
                    var result = bufferHelper.toBuffer().toString();
                    cb(JSON.parse(result));
                });
            });
            // write data to request body
            req.write(dataString);
            req.end();
        }
    };
};

module.exports = client();