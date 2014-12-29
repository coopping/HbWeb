"use strict";
var cheerio = require('cheerio');
var util = require('util');
(function(dust) {

    //Create a helper called 'formatDate'
    dust.helpers.selector = function(chunk, context, bodies, params) {

        //Retrieve the date value from the template parameters.
        var name = dust.helpers.tap(params.name, chunk, context);
        var datas = dust.helpers.tap(params.datas, chunk, context);
        var length = dust.helpers.tap(params.length, chunk, context);
        var output = '';
        var $ = cheerio.load('<div id="out"></div>');
        var datasObject = JSON.parse(datas);
        if (datasObject && datasObject.length > 0) {
            for (var i = 0, l = datasObject.length; i < l; i++) {
                if (i % length == 0) {
                    $('#out').append('<div class="form-group"></div>');
                }
                $('.form-group').last().append('<label class="col-sm-1 control-label">' + datasObject[i].name + '</label>');
                if (datasObject[i].checked === '1') {
                    $('.form-group').last().append(util.format('<div class="col-sm-1"><div class="switch" tabindex="0"><input name="%s" type="checkbox" checked value="%s" /></div></div>', name, datasObject[i].code));
                } else {
                    $('.form-group').last().append(util.format('<div class="col-sm-1"><div class="switch" tabindex="0"><input name="%s" type="checkbox" value="%s" /></div></div>', name, datasObject[i].code));
                }
            }
        }
        output = $.html();
        return chunk.write(output);
    };

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-helpers') : dust);