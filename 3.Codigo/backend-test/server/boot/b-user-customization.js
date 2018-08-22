'use strict';

var jwt = require("jsonwebtoken");

const config = require("./../config.json")

module.exports = (app, cb) => {

    app.post("/api/xusers/login", function (req, res) {

        app.models.XUser.login(req.body, function (err, accessToken) {

            if (err)
                return res.status(500).json({ error: { message: err.message } })

            app.models.XUser.findById(accessToken.userId, { include: ["roles", "institution"] }, function (err, user) {

                let iat = Math.floor(new Date(accessToken.created).getTime() / 1000)
                let exp = iat + (config.session.ttlInMinutes * 60)

                let t = jwt.sign({
                    tid: accessToken.id,
                    iat: iat,
                    exp: exp,
                    userId: accessToken.userId,
                }, 'secret')

                return res.json({ token: t, user: user.toJSON() })

            })

        })

    })

    app.post("/api/xusers/verifyCredentials", function (req, res) {

        app.models.XUser.login(req.body, function (err, accessToken) {

            if (err)
                return res.status(401).json({ error: { message: err.message } })

            app.models.XAccessToken.destroyById(accessToken.id, function (err, d) {

                return res.json({});

            })


        })

    })

    app.post("/api/orders/createNew", async (req, res) => {

        var orderId;

        await app.dataSources.db.transaction(async (models) => {

            let order = await models.Order.create(req.body.orderInfo);
            let units = await order.units.create(req.body.units);

            orderId = order.id;

        });

        let m = await app.models.Order.findById(orderId, { include: { units: true } })

        res.json({ data: m });


    })

    cb();

}
