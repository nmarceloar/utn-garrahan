'use strict';

var jwt = require("jsonwebtoken");

const config = require("./../config.json")

module.exports = (app, cb) => {

    const login = app.models.XUser.login

    app.models.XUser.login = (credentials, include, callback) => {

        login.call(app.models.XUser, credentials, include, (err, token) => {

            if (err || !token) {
                callback(err, token)
                return
            }

            app.models.XUser.findById(token.userId, { include: ['roles', 'institution'] }, (err, user) => {

                let iat = Math.floor(new Date(token.created).getTime() / 1000)
                let exp = iat + (config.session.ttlInMinutes * 60)

                let t = jwt.sign({
                    tid: token.id,
                    iat: iat,
                    exp: exp,
                    userId: token.userId,
                }, 'secret')

                callback(err, { token: t, user: user.toJSON() });

            })

        })

    }

    cb();

}
