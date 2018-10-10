'use strict';

module.exports = function (OrderInfo) {

    OrderInfo.validatesPresenceOf("units", {
        message: "no hay unidades"
    })

    OrderInfo.validate("units", function (err) {

        let us = this.units;

        this.units.every((u, idx) => us.filter((u, i) => i !== idx).every((d) => d.code !== u.code && d.typeId !== u.typeId))



    }, { message: "Hay unidades repetidas" })


};
