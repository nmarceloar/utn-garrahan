'use strict';

module.exports = function (OrderAggregate) {

    let requiredFields = ['code', 'units']

    OrderAggregate.validatesPresenceOf.apply(OrderAggregate, requiredFields)

    OrderAggregate.validate('units', function (err) {

        let units = this.units

        if (!units)
            return

        let map = units.reduce((map, unit) => {

            let id = `[${unit.id}][${unit.code}]`

            map.get(id) ?
                map.set(id, [...map.get(id), unit]) : map.set(id, [unit])

            return map

        }, new Map())

        let invalid = Array.from(map.values()).some(d => d.length > 1)

        if (invalid)
            err()



    }, { message: "No se permiten unidades con igual tipo y codigo" })

};
