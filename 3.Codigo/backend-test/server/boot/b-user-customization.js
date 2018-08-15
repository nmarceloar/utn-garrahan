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

    cb();

}
