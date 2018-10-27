'use strict';

module.exports = function (Institution) {

    Institution.beforeRemote("create", function (ctx, unused, next) {

        console.log(ctx.req.body)

        Institution.find({ where: { cuit: ctx.req.body.cuit } }, function (err, ins) {

            if (err) {
                next(err)
            }

            else {

                if (ins.length > 0)
                    next(new Error("CUIT Repetido"))

                else
                    next()

            }

        })


    })

};
