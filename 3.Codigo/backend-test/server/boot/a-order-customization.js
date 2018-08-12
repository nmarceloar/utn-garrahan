'use strict';

module.exports = (app, cb) => {

    app.get("/api/orders/page", (req, res) => {

        let q = JSON.parse(req.query.filter);

        Promise.all([
            app.models.Order.count(q.where),
            app.models.Order.find(q)
        ])
            .then(([count, items]) => {
                res.json({
                    count: count,
                    items: items
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error: {
                        message: err.message
                    }
                })
            })

    })

    app.put("/api/orders/:orderId/units/irradiated", (req, res) => {

        let ids = req.body.units.map(u => u.id);

        let sample = req.body.units[0];

        app.models.Unit.updateAll({ id: { inq: ids } }, {
            irradiated: sample.irradiated,
            irradiationTag: sample.irradiationTag,
            irradiationStart: sample.irradiationStart,
            irradiationEnd: sample.irradiationEnd,
            irradiatorUserId: sample.irradiatorUserId
        })
            .then(updateInfo => res.json(updateInfo))
            .catch(err => res.status(500).json({ error: { message: err.message } }))

    })

    app.models.Order.observe("before save",  (ctx, next) =>  {

        if (ctx.instance) {

            ctx.instance.lastModified = new Date()

        } else {

            ctx.data.lastModified = new Date()

        }

        next();

    });


    cb()

};
