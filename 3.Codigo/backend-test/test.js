

var express = require("express")

const app = express()

app.use(function checkToken(req, res, next) {

    next()

})

app.get("createUser", function onNewUserRequest(req, res, next) {

    res.json({ message: "BOOM" })

})


app.use(function printExit(err, req, res, next) {

    next(err)

})


console.log(app._router.stack.map(d => d.route))



