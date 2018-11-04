'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');


var app = loopback();

boot(app, __dirname);

app.listen();

module.exports = app; 
