'use strict'

const app = require("./../server")

module.exports = function (req, res, next) {

    let currentUser = req.currentUser
    let orderId = req.params.id

    app.models.Order.findById(orderId, function (err, order) {

        if (err)
            next(err)
        else
            (currentUser.isInternal) || (order.institutionId === currentUser.institutionId) ?
                next() : next(new Error(`No tiene permisos para acceder a la order ${orderId}`))

    })


}
