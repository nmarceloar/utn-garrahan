
'use strict'

module.exports = function (req, res, next) {

    if (req.currentUser.isInternal)
        next()
    else
        next(new Error("No tiene permisos para realizar la operación"))

}
