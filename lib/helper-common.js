"use strict";
(function(dust) {

    //Create a helper called 'security'
    dust.helpers.security = function(chunk, context, bodies, params) {

        //Retrieve the date value from the template parameters.
        var user = dust.helpers.tap(params.user, chunk, context);
        var roles = dust.helpers.tap(params.roles, chunk, context);
        var allowed = dust.helpers.tap(params.allowed, chunk, context);
        var branches = dust.helpers.tap(params.branches, chunk, context);
        var body = bodies.block;
        //Parse the date object using MomentJS
        allowed = allowed.replace(/ /g, '');
        var wanted = allowed.split(',');
        for (var i = 0, l = wanted.length; i < l; i++) {
            if (roles.indexOf(wanted[i]) >= 0) {
                return body(chunk, context);
            }
        }
        return chunk;
    };

    //Create a helper called 'flashMessages'
    dust.helpers.flashMessages = function(chunk, context, bodies, params) {

        //Retrieve the date value from the template parameters.
        var input = dust.helpers.tap(params.messages, chunk, context);
        var messages = JSON.parse(input);
        var output = '';
        for (var i = 0, l = messages.length; i < l; i++) {
            if (messages[i].title) {
                output += '<h4>' + messages[i].title + '</h4>';
            }
            if (messages[i].detail) {
                output += '<p>' + messages[i].detail + '</p>';
            }
            if (messages[i].list) {
                output += '<ul>';
                for (var ctr = 0; ctr < messages[i].list.length; ctr++) {
                    output += '<li>' + messages[i].list[ctr] + '</li>';
                }
                output += '</ul>';
            }
        }
        return chunk.write(output);;
    };

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-helpers') : dust);