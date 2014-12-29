"use strict";
module.exports = function() {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            var roleMenuTree = req.session.roleMenuTree;
            var url = req.originalUrl;
            if (url.indexOf('/user/') >= 0) {
                res.locals.subIndex = -1;
                return next();
            }
            if (url === '/') {
                res.locals.subIndex = -1;
                return next();
            }

            var u = url.split('/');

            for (var i = 0, l = roleMenuTree.length; i < l; i++) {
                if (u.indexOf(roleMenuTree[i].url.replace(/\//g, '')) >= 0) {
                    res.locals.subIndex = i;
                    break;
                }
            }

        }
        return next();
    };
};