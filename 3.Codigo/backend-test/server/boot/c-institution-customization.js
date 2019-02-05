'use strict';

const config = require("./../config.json")

module.exports = (app, cb) => {

    app.put("/api/institutions/:id", async function (req, res, next) {

        var institution

        try {

            await app.dataSources.db.transaction(async (models) => {

                const { Institution } = models

                let i = Institution.findById(req.params.id)

                if (!i)
                    throw new Error("La institución no existe")

                institution = { ...i.toJSON(), ...req.body }

                await Institution.updateAll({ id: i.id }, institution)

            }, { isolationLevel: 'REPEATABLE READ' })

            res.json(institution)

        } catch (err) {

            res.status(500).json({ message: err.message })

        }

    })

    app.post("/api/institutions", async function (req, res, next) {

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


    cb();

}
