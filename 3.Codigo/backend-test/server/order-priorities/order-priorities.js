'use strict'

const app = require("./../server")


const authentication = require("./../middleware/authentication")

const priorities = app.loopback.Router()

priorities.get("/", [authentication], async function (req, res) {

    let ops = await app.models.OrderPriority.find()

    res.json(ops)

})


module.exports = priorities
