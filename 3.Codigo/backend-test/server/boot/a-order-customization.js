'use strict';

module.exports = (app, cb) => {

    app.models.Order.observe("before save", (ctx, next) => {

        if (ctx.instance) {

            ctx.instance.lastModified = new Date()

        } else {

            ctx.data.lastModified = new Date()

        }

        next();

    });

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

            let institution =
                await app.models.Institution.findById(orderInfo.institutionId)

            let pendingOrder = (await app.models.OrderStatus.find({ where: { name: { regexp: `.*PENDIENTE.*` } } }))[0]

            let order = await app.models.Order.create({
                code: orderInfo.code,
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

            await institution.updateAttributes({ orderCount: (institution.orderCount + 1) })

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

    app.get("/api/orders/dailyReport", async function (req, res) {

        var startOfDay = new Date(req.query.date)

        var startOfNextDay = new Date(req.query.date)
        startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1)
        startOfNextDay.setTime(startOfNextDay.getTime() - 1)

        let institutionTypes = await app.models.InstitutionType.find()

        let orders = await app.models.Order.find({
            where: {
                completionDate: { between: [startOfDay.toISOString(), startOfNextDay.toISOString()] }
            },
            include: [
                { institution: { type: true } },
                { unitTypeMappings: { unitType: true } }
            ]
        })

        let report = {
            date: new Date(req.query.date),
            total: orders.length,
            orders: orders,
            institutionTypes: institutionTypes
        }

        res.json(report);

    })

    app.get("/api/orders/monthlyReport", async (req, res) => {

        var startOfMonth = new Date(req.query.date)

        var endOfMonth = new Date(req.query.date)
        endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1)
        endOfMonth.setTime(endOfMonth.getTime() - 1)

        let institutions = await app.models.Institution.find({ include: [{ type: true }] })
        let unitTypes = await app.models.UnitType.find()
        let institutionTypes = await app.models.InstitutionType.find()

        let orders = await app.models.Order.find({
            where: {
                completionDate: { between: [startOfMonth.toISOString(), endOfMonth.toISOString()] }
            },
            include: [
                { unitTypeMappings: { unitType: true } },
                { institution: { type: true } },
                { irradiations: { units: { type: true } } }
            ]
        })

        let report = {
            startOfMonth,
            institutions,
            institutionTypes,
            unitTypes,
            orders
        }

        res.json(report);

    })


    app.put("/api/unit-types/:id", async function (req, res) {

        let ut = await app.models.UnitType.findById(req.params.id)

        ut = await ut.updateAttributes({
            name: req.body.name
        })

        res.json(ut)

    })

    cb()

};
