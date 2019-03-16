'use strict';

const app = require("./../server")

const authentication = require("./../middleware/authentication")
const member = require("./../middleware/authorization.member")
const isAdmin = require("./../middleware/is-admin")
const isInternal = require("./../middleware/is-internal")


let conf = [
    { name: "minTimeOfIrradiationInMinutes", type: Number },
    { name: "tagCodeCharDiscard", type: Number },
    { name: "unitCodeCharDiscard", type: Number }
]

const configuration = app.loopback.Router()

configuration.get("/", [authentication, isInternal], async function (req, res) {

    let config = await app.models.ConfigElement.findOne();

    res.json(config);

})

configuration.put("/", [authentication, isAdmin], async function (req, res) {

    let config = await app.models.ConfigElement.findOne()

    config = await config.updateAttributes({
        ...req.body
    })

    res.json(config);


})

module.exports = configuration

