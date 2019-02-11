'use strict'

const app = require("./../server")


const authentication = require("./../middleware/authentication")

const orderStatus = app.loopback.Router()

orderStatus.get("/", [authentication], async function (req, res) {

    res.json(await app.models.OrderStatus.find())

})

module.exports = orderStatus
