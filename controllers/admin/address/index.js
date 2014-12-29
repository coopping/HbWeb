"use strict";
var http = require('http');
var Iconv = require('iconv').Iconv;
var BufferHelper = require('bufferhelper');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var db = mongoose.connection.db;

function getData(options, cb) {
    var data = {};
    var req = http.request(options, function(response) {
        var bufferHelper = new BufferHelper();
        response.on('data', function(chunk) {
            bufferHelper.concat(chunk);
        });
        response.on('end', function() {
            var iconv = new Iconv('GBK', 'utf-8');
            var resultBuffer = iconv.convert(bufferHelper.toBuffer());

            var result = resultBuffer.toString();
            var $ = cheerio.load(result);
            $("select option").each(function() {
                //console.log("value:%s-text:%s",$(this).val(), $(this).text().replace('*', ''));
                if ($(this).val()) {
                    data[$(this).val()] = $(this).text().replace('*', '');
                }
            });
            cb(data);
        });
    });
    // write data to request body
    req.end();
}

module.exports = function(app) {
    app.get('/provinces', function(req, res, next) {
        // console.log('in');
        db.collection('provinces', function(err, collection) {
            collection.find({}, {
                _id: 0
            }, {
                sort: {
                    key: 1
                }
            }).toArray(function(err, provinces) {
                if (provinces.length > 0) {
                    //console.log('find in db');
                    res.json({
                        message: 'ok',
                        provinces: provinces
                    });
                } else {
                    // var options = {
                    //     host: '10.1.1.104',
                    //     port: 8080,
                    //     path: 'http://trade.jd.com/dynamic/consignee/getProvinces.action',
                    //     method: 'get',
                    //     headers: {
                    //         Host: "trade.jd.com"
                    //     }
                    // };
                    var options = {
                        host: 'trade.jd.com',
                        path: '/dynamic/consignee/getProvinces.action',
                        method: 'get',
                        headers: {
                            Host: "trade.jd.com"
                        }
                    };
                    var out = {};
                    var returnData = [];
                    getData(options, function(data) {
                        out = data;
                        db.collection('provinces', function(err, collection) {
                            for (var o in out) {
                                var v = {
                                    key: parseInt(o),
                                    value: out[o]
                                };
                                collection.insert(v, function() {});
                                returnData.push(v);
                            }
                            res.json({
                                message: 'ok',
                                provinces: returnData
                            });
                        });
                    });
                }
            });
        });
    });

    app.get('/citys', function(req, res, next) {
        var province = req.query.province;
        db.collection('citys', function(err, collection) {
            collection.findOne({
                key: parseInt(province)
            }, {
                _id: 0
            }, {
                sort: {
                    'value.key': 1
                }
            }, function(err, citys) {
                if (citys) {
                    res.json({
                        message: 'ok',
                        citys: citys.value
                    });
                } else {
                    // var options = {
                    //     host: '10.1.1.104',
                    //     port: 8080,
                    //     path: 'http://trade.jd.com/dynamic/consignee/getCitys.action?consigneeParam.provinceId=' + province,
                    //     method: 'get',
                    //     headers: {
                    //         Host: "trade.jd.com"
                    //     }
                    // };
                    var options = {
                        host: 'trade.jd.com',
                        path: '/dynamic/consignee/getCitys.action?consigneeParam.provinceId=' + province,
                        method: 'get',
                        headers: {
                            Host: "trade.jd.com"
                        }
                    };
                    var out = {};
                    var returnData = [];
                    getData(options, function(data) {
                        out = data;
                        db.collection('citys', function(err, collection) {
                            for (var o in out) {
                                var v = {
                                    key: parseInt(o),
                                    value: out[o]
                                };
                                returnData.push(v);
                            }
                            collection.insert({
                                key: parseInt(province),
                                value: returnData
                            }, function() {});
                            res.json({
                                message: 'ok',
                                citys: returnData
                            });
                        });
                    });
                }
            });
        });
    });

    app.get('/countys', function(req, res, next) {
        var city = req.query.city;
        db.collection('countys', function(err, collection) {
            collection.findOne({
                key: parseInt(city)
            }, {
                _id: 0
            }, {
                sort: {
                    'value.key': 1
                }
            }, function(err, countys) {
                if (countys) {
                    res.json({
                        message: 'ok',
                        countys: countys.value
                    });
                } else {
                    // var options = {
                    //     host: '10.1.1.104',
                    //     port: 8080,
                    //     path: 'http://trade.jd.com/dynamic/consignee/getCountys.action?consigneeParam.cityId=' + city,
                    //     method: 'get',
                    //     headers: {
                    //         Host: "trade.jd.com"
                    //     }
                    // };
                    var options = {
                        host: 'trade.jd.com',
                        path: '/dynamic/consignee/getCountys.action?consigneeParam.cityId=' + city,
                        method: 'get',
                        headers: {
                            Host: "trade.jd.com"
                        }
                    };
                    var out = {};
                    var returnData = [];
                    getData(options, function(data) {
                        out = data;
                        db.collection('countys', function(err, collection) {
                            for (var o in out) {
                                var v = {
                                    key: parseInt(o),
                                    value: out[o]
                                };
                                returnData.push(v);
                            }
                            collection.insert({
                                key: parseInt(city),
                                value: returnData
                            }, function() {});
                            res.json({
                                message: 'ok',
                                countys: returnData
                            });
                        });
                    });
                }
            });
        });
    });

    app.get('/towns', function(req, res, next) {
        var county = req.query.county;
        db.collection('towns', function(err, collection) {
            collection.findOne({
                key: parseInt(county)
            }, {
                _id: 0
            }, {
                sort: {
                    'value.key': 1
                }
            }, function(err, towns) {
                if (towns) {
                    res.json({
                        message: 'ok',
                        towns: towns.value
                    });
                } else {
                    // var options = {
                    //     host: '10.1.1.104',
                    //     port: 8080,
                    //     path: 'http://trade.jd.com/dynamic/consignee/getTowns.action?consigneeParam.countyId=' + county,
                    //     method: 'get',
                    //     headers: {
                    //         Host: "trade.jd.com"
                    //     }
                    // };
                    var options = {
                        host: 'trade.jd.com',
                        path: '/dynamic/consignee/getTowns.action?consigneeParam.countyId=' + county,
                        method: 'get',
                        headers: {
                            Host: "trade.jd.com"
                        }
                    };
                    var out = {};
                    var returnData = [];
                    getData(options, function(data) {
                        out = data;
                        db.collection('towns', function(err, collection) {
                            for (var o in out) {
                                var v = {
                                    key: parseInt(o),
                                    value: out[o]
                                };
                                returnData.push(v);
                            }
                            collection.insert({
                                key: parseInt(county),
                                value: returnData
                            }, function() {});
                            res.json({
                                message: 'ok',
                                towns: returnData
                            });
                        });
                    });
                }
            });
        });
    });
}