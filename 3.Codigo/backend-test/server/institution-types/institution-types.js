
const app = require("./../server")

const authentication = require("./../middleware/authentication")

const institutionTypes = app.loopback.Router()

institutionTypes.get("/", [authentication], async function (req, res) {

    let q = JSON.parse(req.query.filter) || {}

    res.json(await app.models.InstitutionType.find(q))

})

module.exports = institutionTypes
