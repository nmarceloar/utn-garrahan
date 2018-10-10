'use strict';

module.exports = function (XUser) {

    XUser.prototype.enable = async function () {

        if (this.active)
            throw new Error("La cuenta ya se encuentra activa")

        return (await this.updateAttributes({ active: true }))


    }

    XUser.prototype.disable = async function () {

        if (!this.active)
            throw new Error("La cuenta ya se encuentra desactivada")

        return (await this.updateAttributes({ active: false }))


    }


};
