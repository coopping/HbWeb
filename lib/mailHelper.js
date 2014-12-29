var email = require("emailjs");
var _emailServer = null;
var _localhost = '';
var _from = '';
var mail = function() {
    return {
        config: function(conf) {
            _emailServer = email.server.connect(conf.server);
            _localhost = conf.localhost;
            _from = conf.from;
        },
        helper: function() {
            return {
                server: _emailServer,
                localhost: _localhost,
                from: _from
            }
        }
    };
};

module.exports = mail();