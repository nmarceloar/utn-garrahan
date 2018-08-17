'use strict';
var random = new require("chance").Chance();
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

    app.models.Order.observe("before save", (ctx, next) => {

        if (ctx.instance) {

            ctx.instance.lastModified = new Date()

        } else {

            ctx.data.lastModified = new Date()

        }

        next();

    });

    app.post("/api/orders/:orderId/irradiations", function (req, res) {

        app.models.Order.findById(req.params.orderId)
            .then((order) => order.irradiations.create({
                irradiationTag: req.body.irradiationTag,
                irradiationEnd: req.body.irradiationEnd,
                irradiationStart: req.body.irradiationStart,
                irradiationTime: req.body.irradiationTime,
                comments: req.body.comments,
                irradiatorId: req.body.irradiatorId
            }))
            .then((irradiation) => app.models.Unit.updateAll({ id: { inq: req.body.units } }, {
                irradiated: true,
                irradiationId: irradiation.id
            }))
            .then(() => app.models.Order.markIfCompleted(req.params.orderId))
            .then((updateInfo) => res.json(updateInfo))
            .catch(err => res.status(500).json({ error: { message: err.message } }))

    })


    app.post("/api/orders", async (req, res) => {

        let orderInfo = req.body;

        try {

            let pendingOrder = (await app.models.OrderStatus.find({ where: { name: { regexp: `.*PENDIENTE.*` } } }))[0]

            let order = await app.models.Order.create({
                code: random.guid(),
                priorityId: orderInfo.priorityId,
                statusId: pendingOrder.id,
                carrier: orderInfo.carrier,
                ownerId: orderInfo.ownerId,
                institutionId: orderInfo.institutionId,
                unitCount: orderInfo.units.length
            })

            let units = await order.units.create(orderInfo.units);

            let unitTypes = await app.models.UnitType.find();

            let mappings = await Promise.all(
                unitTypes.map(ut =>
                    Promise.all([
                        Promise.resolve(order.id),
                        Promise.resolve(ut.id),
                        app.models.Unit.count({
                            and: [
                                { orderId: order.id },
                                { unitTypeId: ut.id }
                            ]
                        })
                    ])
                )
            )

            let d = await Promise.all(mappings.map(mapping => app.models.UnitTypeMapping.create({
                orderId: mapping[0],
                unitTypeId: mapping[1],
                count: mapping[2]
            })))

            return res.json(order.toJSON())

        } catch (err) {

            console.log(err)

            return res.status(500).json({ error: { message: err.message } })

        }

    })

    app.put("/api/orders/update/:orderId", async (req, res) => {

        let orderInfo = req.body;

        try {

            let order = await app.models.Order.upsert({
                id: req.params.orderId,
                code: orderInfo.code,
                priorityId: orderInfo.priorityId,
                statusId: orderInfo.statusId,
                carrier: orderInfo.carrier,
                ownerId: orderInfo.ownerId,
                institutionId: orderInfo.institutionId,
                unitCount: orderInfo.units.length
            })

            if (orderInfo.removedUnitIds.length > 0) {
                await app.models.Unit.destroyAll({ id: { inq: orderInfo.removedUnitIds } })
            }

            let unitsWithId = orderInfo.units.filter(u => u.id);
            await Promise.all(unitsWithId.map(u => app.models.Unit.upsert(u)));

            let unitsWithoutId = orderInfo.units.filter(u => !u.id)
            await order.units.create(unitsWithoutId);

            await order.unitTypeMappings.destroyAll();

            let unitTypes = await app.models.UnitType.find();

            let mappings = await Promise.all(
                unitTypes.map(ut =>
                    Promise.all([
                        Promise.resolve(order.id),
                        Promise.resolve(ut.id),
                        app.models.Unit.count({
                            and: [
                                { orderId: order.id },
                                { unitTypeId: ut.id }
                            ]
                        })
                    ])
                )
            )

            let d = await Promise.all(mappings.map(mapping => app.models.UnitTypeMapping.create({
                orderId: mapping[0],
                unitTypeId: mapping[1],
                count: mapping[2]
            })))

            return res.json(order.toJSON())

        } catch (err) {

            console.log(err)

            return res.status(500).json({ error: { message: err.message } })

        }

    })


    cb()

};
