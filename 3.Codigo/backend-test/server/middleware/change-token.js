"use strict";


var jwt_decode = require("jwt-decode");

module.exports = function(options) {

  return function changeToken(req, res, next) {

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {

      req.headers.authorization = jwt_decode(req.headers.authorization.split(' ')[1]).tid; 

    }

    next()

  };
};
