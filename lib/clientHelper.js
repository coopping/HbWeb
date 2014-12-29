"use strict";
var Client = require('../models/oauth/Client');

var _clients = [];
(function getClients() {
    Client.find({}, 'clientID name', function(err, clients) {
        if (!err) {
            for (var i = 0, l = clients.length; i < l; i ++) {
                _clients.push(clients[i]);
            }
            _clients.push({
                clientID: 'extension',
                name: '电商后台管理系统'
            });
        }
    });
})();

exports.getClients = (function() {
    return _clients;
});