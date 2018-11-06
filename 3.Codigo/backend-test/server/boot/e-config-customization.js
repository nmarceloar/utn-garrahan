'use strict';

let conf = [
    { name: "minTimeOfIrradiationInMinutes", type: Number },
    { name: "tagCodeCharDiscard", type: Number },
    { name: "unitCodeCharDiscard", type: Number }
]

module.exports = (app, cb) => {

    app.get("/api/config", async function (req, res) {

        let configElements = await app.models.ConfigElement.find();

        res.json(configElements);

    })

    app.put("/api/config/:name", async function (req, res) {

        let d = await app.models.ConfigElement.findOne({ where: { name: req.params.name } })

        d = await d.updateAttributes({
            value: req.body.value,
            description: req.body.description,
            lastUpdated: new Date()
        })

        res.json(d);


    })

    cb()

};
