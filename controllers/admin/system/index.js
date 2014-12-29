var auth = require('../../../lib/auth');
module.exports = function(router) {
    router.get('/', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
        res.redirect('/admin/system/menus');
    });
}