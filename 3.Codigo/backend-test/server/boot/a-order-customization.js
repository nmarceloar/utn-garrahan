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

    cb()

};
