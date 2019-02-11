
'use strict'

module.exports = function (req, res, next) {

    if (req.currentUser.roles.some(role => role.name === "admin"))
        next()
    else
        next(new Error("No tiene permisos para realizar la operación"))

}
