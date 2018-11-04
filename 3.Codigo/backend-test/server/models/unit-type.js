'use strict';

module.exports = function (UnitType) {

    UnitType.prototype.enable = function () {

        this.enabled = true;

        return this.save()


    }

    UnitType.enableById = async function (id) {

        let ut = await UnitType.findById(id)

        if (!ut)
            throw new Error("No existen hemocomponentes con el ID indicado");

        return ut.enable();

    }



};
