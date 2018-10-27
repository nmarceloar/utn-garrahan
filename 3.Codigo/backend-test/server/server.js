'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = loopback();

app.use(function (req, res, next) {

    console.log(req.headers)

    next();

})

boot(app, __dirname, function (err) {

    if (err)
        throw err;

    app.listen(function (err) {

        if (err)
            throw err

        app.emit("started")
        console.log(`Listening ...`);

    })

});


module.exports = app; 
