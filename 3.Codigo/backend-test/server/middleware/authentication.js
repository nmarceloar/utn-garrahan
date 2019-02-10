
const app = require("./../server")

const jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {

    let token = req.headers.authorization

    if (!token) {

        next(new Error('No autorizado'))

    }

    else {

        jwt.verify(token.split(' ')[1], 'secret', function (err, payload) {

            if (err)
                next(err)
            else {

                app.models.XUser.findById(payload.userId, { include: ["roles"] }, function (err, user) {

                    if (err)
                        next(err)
                    else {
                        req.currentUser = user.toJSON()
                        next()
                    }

                })

            }

        })

    }


}
