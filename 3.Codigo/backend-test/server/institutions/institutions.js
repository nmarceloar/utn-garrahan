
const app = require("./../server")

const config = require("./../config.json")


const authentication = require("./../middleware/authentication")
const member = require("./../middleware/authorization.member")
const isAdmin = require("./../middleware/is-admin")
const isInternal = require("./../middleware/is-internal")


const institutions = app.loopback.Router()

institutions.get("/:id(\\d+)", [authentication], async function (req, res) {

    let q = JSON.parse(req.query.filter) || {}

    res.json(await app.models.Institution.findById(req.params.id, q))

})

institutions.put("/:id(\\d+)", [authentication, isAdmin], async function (req, res, next) {

    let id = req.params.id

    var i

    try {

        await app.dataSources.db.transaction(async models => {

            const { Institution } = models

            let institution = await Institution.findById(id)

            i = await institution.updateAttributes({ ...req.body })

        }, { isolationLevel: 'REPEATABLE READ' })

        res.json(i)

    } catch (err) {

        res.status(500).json({ message: err.message })

    }


})

institutions.post("/", [authentication, isAdmin], async function (req, res, next) {

    let data = req.body;

    var i;

    try {

        await app.dataSources.db.transaction(async (models) => {

            const { Institution } = models

            let count =
                await Institution.count({ or: [{ cuit: data.cuit }, { email: data.email }] })

            if (count)
                throw new Error("Ya existe otra institución con el mismo CUIT ó Email");

            i = await Institution.create(data)

        }, { isolationLevel: app.models.Institution.Transaction.REPETEABLE_READ })

        res.status(201).json(i);

    } catch (err) {

        res.status(500).json({ message: err.message })

    }


})

institutions.get("/", [authentication], async function (req, res) {

    let q = JSON.parse(req.query.filter) || {}

    try {

        res.status(200).json(await app.models.Institution.find(q))

    } catch (err) {

        res.status(500).json({ message: err.message })

    }


})

module.exports = institutions
