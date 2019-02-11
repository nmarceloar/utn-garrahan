
const app = require("./../server")

const unitTypes = app.loopback.Router()


const authentication = require("./../middleware/authentication")
const isAdmin = require("./../middleware/is-admin")


unitTypes.put("/:id(\\d+)", [authentication, isAdmin], async function (req, res) {

    let ut = await app.models.UnitType.findById(req.params.id)

    ut = await ut.updateAttributes({
        name: req.body.name
    })

    res.json(ut)

})

unitTypes.get("/", [authentication], async function (req, res) {

    let uts = await app.models.UnitType.find({})

    res.json(uts)

})

module.exports = unitTypes
