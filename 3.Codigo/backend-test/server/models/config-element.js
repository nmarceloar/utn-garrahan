'use strict';

module.exports = function (ConfigElement) {

    ConfigElement.observe("before save", function (ctx, next) {

        if (ctx.instance) {

            ctx.instance.lastUpdated = new Date()

        } else {

            ctx.data.lastUpdated = new Date()

        }

        next();

    })

};
