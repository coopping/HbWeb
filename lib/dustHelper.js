"use strict";
var dust = require('adaro');
var pt = require('path');
var fs = require('fs');
var join = pt.join;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var _staticRootPath = '';

// exports.render = function(res, template, renderData, p, cb) {
//     res.render(template, renderData, function(err, html) {
//         if (err) return cb(err);
//         var name = new ObjectId();
//         var path = name.toString();

//         if (typeof p === 'function') {
//             cb = p;
//         } else {
//             if (p) {
//                 path = p;
//             }
//         }
//         var file = join(__dirname + '/../public/html', path + '.html');
//         fs.writeFile(file, html, function(err) {
//             if (err) {
//                 return cb(err)
//             };
//             cb(null, pt.relative(__dirname + '/../public', file));
//         });
//     })
// };

var helper = function() {
    return {
        config: function(conf) {
            _staticRootPath = conf;
        },
        render: function(res, template, renderData, p, cb) {
            res.render(template, renderData, function(err, html) {
                if (err) return cb(err);
                var name = new ObjectId();
                var path = name.toString();

                if (typeof p === 'function') {
                    cb = p;
                } else {
                    if (p) {
                        path = p;
                    }
                }
                var file = join(__dirname + '/../' + _staticRootPath + 'html', path + '.html');
                fs.writeFile(file, html, function(err) {
                    if (err) {
                        return cb(err)
                    };
                    cb(null, pt.relative(__dirname + '/../' + _staticRootPath, file));
                });
            })
        },
        remove: function(p, cb) {
            var file = join(__dirname + '/../' + _staticRootPath + p);
            fs.unlink(file, function(err) {
                return cb(err);
            });
        }
    };
};

module.exports = helper();