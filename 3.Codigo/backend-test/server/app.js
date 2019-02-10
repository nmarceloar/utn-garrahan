
'use strict'

const app = require("./server.js")

var boot = require('loopback-boot');

boot(app, __dirname);

app.use("/api/xusers", require("./users/users"))
app.use("/api/orders", require("./orders/orders"))
app.use("/api/unit-types", require("./unit-types/unit-types"))
app.use("/api/institutions", require("./institutions/institutions"))
app.use("/api/config", require("./configuration/configuration"))
app.use("/api/orderstatus", require("./order-status/order-status"))
app.use("/api/order-priorities", require("./order-priorities/order-priorities"))
app.use("/api/institutionTypes", require("./institution-types/institution-types"))

app.use(function (err, req, res, next) {

    res.status(500).json({ message: err.message || 'Error Interno' })

})

app.listen(function (err) {

    if (err)
        throw err

    console.log("app started ...")

})






