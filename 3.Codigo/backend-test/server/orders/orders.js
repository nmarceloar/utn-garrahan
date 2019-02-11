const app = require("./../server")

const orders = app.loopback.Router()

const authentication = require("./../middleware/authentication")
const member = require("./../middleware/authorization.member")
const isAdmin = require("./../middleware/is-admin")
const isInternal = require("./../middleware/is-internal")

orders.get("/page", [authentication], (req, res) => {

    let q = JSON.parse(req.query.filter);

    let where = req.currentUser.isInternal ?
        { ...q.where } : { ...q.where, institutionId: req.currentUser.institutionId }

    let _q = { ...q, where: where }

    Promise.all([
        app.models.Order.count(_q.where),
        app.models.Order.find(_q)
    ])
        .then(([count, items]) => {
            res.json({
                count: count,
                items: items
            })
        })
        .catch(err => {
            res.status(500).json({
                error: {
                    message: err.message
                }
            })
        })

})

orders.get("/:id(\\d+)", [authentication, member], async function (req, res) {

    let query = JSON.parse(req.query.filter) || {}

    let order = await app.models.Order.findById(req.params.id, query)

    if (!order)
        throw new Error(`No existen órdenes con id: ${req.params.id}`)

    res.json(order)

})

orders.get("/dailyReport", [authentication, isInternal], async function (req, res) {

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

orders.get("/monthlyReport", [authentication, isInternal], async (req, res) => {

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

orders.post("/:id(\\d+)/irradiations", [authentication, isInternal], async function (req, res) {

    let irradiation

    try {

        await app.dataSources.db.transaction(async (models) => {

            var done

            const { Order, Unit, OrderStatus } = models

            let order = await Order.findById(req.params.id)

            if (!order)
                throw new Error(`No existen órdenes con id: ${req.params.id}`)

            let orderUnits = await Unit.find({ where: { orderId: req.params.id } })

            done = orderUnits.every(u => u.irradiated)

            if (done)
                throw new Error(`No se pueden irradiar las unidades, la orden ya se encuentra irradiada en su totalidad`)

            irradiation = await order.irradiations.create({
                ...req.body,
                irradiatorId: req.currentUser.id
            })

            await Promise.all(orderUnits.filter(u => req.body.units.includes(u.id))
                .map(u => u.updateAttributes({
                    irradiated: true,
                    irradiationId: irradiation.id,
                    irradiatorUserId: req.currentUser.id
                })))

            done = orderUnits.every(u => u.irradiated)

            if (done) {

                let status = (await OrderStatus.find({ where: { name: { regexp: `.*IRRADIADA.*` } } }))[0]

                await order.updateAttributes({
                    statusId: status.id,
                    completionDate: new Date()
                })

            }

        }, { isolationLevel: 'REPEATABLE READ' })

        res.status(201).json(irradiation)

    } catch (err) {

        res.status(500).json({ message: err.message })

    }

})

orders.post("/:id(\\d+)/comments", [authentication, isInternal], async function (req, res) {

    var comment

    try {

        await app.dataSources.db.transaction(async models => {

            const { Order, Comment } = models

            let order = await Order.findById(req.params.id)

            if (!order)
                throw new Error(`No existen órdenes con id: ${req.params.id}`)

            comment = await order.comments.create({
                text: req.body.text,
                date: new Date(),
                operatorId: req.currentUser.id
            })

        }, { isolationLevel: 'REPEATABLE READ' })

        res.status(201).json(comment)

    } catch (err) {

        res.status(500).json({ message: err.message })

    }

})

orders.post("/", [authentication], async function (req, res) {

    let orderInfo = req.body;

    var order

    try {

        await app.dataSources.db.transaction(async models => {

            const { Institution, OrderStatus, Order, UnitType, Unit, UnitTypeMapping } = models

            let institution =
                await Institution.findById(orderInfo.institutionId)

            let pendingOrder = (await OrderStatus.find({ where: { name: { regexp: `.*PENDIENTE.*` } } }))[0]

            order = await Order.create({
                code: orderInfo.code,
                priorityId: orderInfo.priorityId,
                statusId: pendingOrder.id,
                carrier: orderInfo.carrier,
                ownerId: orderInfo.ownerId,
                institutionId: orderInfo.institutionId,
                unitCount: orderInfo.units.length
            })

            let units = await order.units.create(orderInfo.units);

            let unitTypes = await UnitType.find();

            let mappings = await Promise.all(
                unitTypes.map(ut =>
                    Promise.all([
                        Promise.resolve(order.id),
                        Promise.resolve(ut.id),
                        Unit.count({
                            and: [
                                { orderId: order.id },
                                { unitTypeId: ut.id }
                            ]
                        })
                    ])
                )
            )

            let d = await Promise.all(mappings.map(mapping => UnitTypeMapping.create({
                orderId: mapping[0],
                unitTypeId: mapping[1],
                count: mapping[2]
            })))

            await Institution.increaseOrderCount(institution.id)

        }, { isolationLevel: 'REPEATABLE READ' })

        res.json(order)

    } catch (err) {

        res.status(500).json({ error: { message: err.message } })

    }

})

orders.put("/update/:id(\\d+)", [authentication, member], async (req, res) => {

    let orderInfo = req.body;

    let id = req.params.id

    try {

        let order = await app.models.Order.upsert({
            id: id,
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

orders.patch("/:id(\\d+)", [authentication, member], async function (req, res) {

    var order

    try {

        await app.dataSources.db.transaction(async models => {

            const { Order } = models

            order = await Order.findById(req.params.id)

            if (!order)
                throw new Error("La orden no existe")

            order = await order.updateAttributes({ ...req.body })

        }, { isolationLevel: 'REPEATABLE READ' })

        res.json(order)

    } catch (err) {

        res.status(500).json({ message: err.message })

    }


})

orders.post("/:id(\\d+)/conciliationComments", [authentication, isInternal], async function (req, res) {

    let comment

    try {

        await app.dataSources.db.transaction(async models => {

            const { Order } = models

            let order = await Order.findById(req.params.id)

            if (!order)
                throw new Error(`No hay órdenes con id: ${req.params.id}`)

            comment = await order.conciliationComments.create({ ...req.body })

        }, { isolationLevel: 'REPEATABLE READ' })

        res.json(comment)

    } catch (err) {

        res.status(500).json({ message: err.message })

    }


})

module.exports = orders
