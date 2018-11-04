//'use strict';

//var random = new require("chance").Chance();

//function randomBetween(min, max) {
//    return Math.round(min + Math.random() * (max - min))
//}


//module.exports = async (app, cb) => {

//    async function updateOrderCount(institutionId) {

//        let count = await app.models.Order.count({ institutionId: institutionId })
//        await app.models.Institution.updateAll({ id: institutionId }, { orderCount: count })

//        return

//    }

//    async function updateUserCount(institutionId) {

//        let count = await app.models.XUser.count({ institutionId: institutionId })
//        await app.models.Institution.updateAll({ id: institutionId }, { userCount: count })

//        return

//    }

//    async function updateCount(userId) {

//        let count = await app.models.Order.count({ ownerId: userId })
//        await app.models.XUser.updateAll({ id: userId }, { orderCount: count })

//    }

//    try {

//        var clientes = await app.models.XUser.find({
//            where: {
//                isInternal: false
//            },
//            include: ["institution"]
//        })

//        var unitTypes = await app.models.UnitType.find({});

//        var orderStatus = (await app.models.OrderStatus.find({ where: { name: "PENDIENTE" } }))[0];

//        var orderPriorities = await app.models.OrderPriority.find({});

//        await Promise.all(Array.from({ length: 100 })
//            .map(() => (async () => {

//                var client = clientes[randomBetween(0, clientes.length - 1)];

//                var order = await app.models.Order.create({
//                    code: random.string({ length: 8, pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" }),
//                    carrier: random.name(),
//                    creationDate: random.date({ year: 2017 }),
//                    priorityId: orderPriorities[randomBetween(0, orderPriorities.length - 1)].id,
//                    ownerId: client.id,
//                    statusId: orderStatus.id,
//                    institutionId: client.institutionId
//                })

//                var units = Array.from({ length: randomBetween(5, 10) })
//                    .map(d => ({
//                        code: random.guid(),
//                        creationDate: order.creationDate,
//                        irradiated: false,
//                        unitTypeId: unitTypes[randomBetween(0, unitTypes.length - 1)].id
//                    }))

//                let _units = await order.units.create(units);

//                await app.models.Order.updateAll({ id: order.id }, { unitCount: _units.length });

//                let mappings = await Promise.all(
//                    unitTypes.map(ut =>
//                        Promise.all([
//                            Promise.resolve(order.id),
//                            Promise.resolve(ut.id),
//                            app.models.Unit.count({
//                                and: [
//                                    { orderId: order.id },
//                                    { unitTypeId: ut.id }
//                                ]
//                            })
//                        ])
//                    )
//                )

//                let d = await Promise.all(mappings.map(mapping => app.models.UnitTypeMapping.create({
//                    orderId: mapping[0],
//                    unitTypeId: mapping[1],
//                    count: mapping[2]
//                })))


//            })()))


//        let inst = await app.models.Institution.find({})

//        await Promise.all(inst.map(i => updateUserCount(i.id)))
//        await Promise.all(inst.map(i => updateOrderCount(i.id)))

//        let users = await app.models.XUser.find({})

//        await Promise.all(users.map(u => updateCount(u.id)))

//    } catch (err) {

//        console.log(err)

//        process.exit(1)

//    }

//    cb()

//};

