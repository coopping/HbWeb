'use strict';

var kraken = require('kraken-js');
var app = require('express')();
var options = require('./lib/spec')(app);

app.use(kraken(options));

app.on('start', function() {
    var port = process.env.PORT || app.kraken.get('port');
    app.listen(port, function(err) {
    	global.env = app.settings.env;
        console.log('[%s] Listenling on http://localhost:%d', app.settings.env, port);
    })
})