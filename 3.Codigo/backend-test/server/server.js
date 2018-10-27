'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = loopback();

boot(app, __dirname, function (err) {

    if (err)
        throw err;

    app.listen(function (err) {

        if (err)
            throw err

        console.log(`Listening ...`);

    })

});


module.exports = app; 
