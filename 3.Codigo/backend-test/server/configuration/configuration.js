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

    let configElements = await app.models.ConfigElement.find();

    res.json(configElements);

})

configuration.put("/:name", [authentication, isAdmin], async function (req, res) {

    let d = await app.models.ConfigElement.findOne({ where: { name: req.params.name } })

    d = await d.updateAttributes({
        value: req.body.value,
        description: req.body.description,
        lastUpdated: new Date()
    })

    res.json(d);


})

module.exports = configuration

