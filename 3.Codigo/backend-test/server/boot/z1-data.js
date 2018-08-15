'use strict';

var data = require("../data/data")

function randomBetween(min, max) {
    return Math.floor(min + Math.random() * (max - min))
}

module.exports = async (app, cb) => {

    try {

        var institutionTypes = await app.models.InstitutionType.create(data.institutionTypes)
        var institutions = await app.models.Institution.create(
            data.institutions.map(i => ({
                ...i,
                typeId: institutionTypes[randomBetween(0, institutionTypes.length - 1)].id
            }))
        )
        var unitTypes = await app.models.UnitType.create(data.unitTypes)
        var orderStatuses = await app.models.OrderStatus.create(data.orderStatuses)
        var orderPriorities = await app.models.OrderPriority.create(data.orderPriorities)

        var operador = await app.models.XUser.create(data.users[0])
        var administrador = await app.models.XUser.create(data.users[1])
        var cliente1 = await app.models.XUser.create({
            ...data.users[2],
            institutionId: institutions[2].id
        })
        var cliente2 = await app.models.XUser.create({
            ...data.users[3],
            institutionId: institutions[4].id
        })

        var op = await app.models.XRole.create(data.roles[0]);
        var admin = await app.models.XRole.create(data.roles[1]);
        var client = await app.models.XRole.create(data.roles[2]);
        var client = await app.models.XRole.create(data.roles[2]);

        await operador.roles.add(op)
        await administrador.roles.add(op)
        await administrador.roles.add(admin)
        await cliente1.roles.add(client)
        await cliente2.roles.add(client)

    } catch (err) {

        console.log(err)

        process.exit(1)

    }

    cb()

};

