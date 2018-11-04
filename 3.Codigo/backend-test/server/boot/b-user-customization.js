'use strict';

var jwt = require("jsonwebtoken");

var mailingService = require("./../mailer")

const config = require("./../config.json")

const templates = require("./../templates")

module.exports = (app, cb) => {

    app.post("/api/xusers/login", function (req, res, next) {

        app.models.XUser.findOne({ where: { username: req.body.username } }, function (err, user) {

            if (err)
                return res.status(500).json({ message: err.message });

            if (!user)
                return res.status(401).json({ message: "El usuario especificado no existe" });

            if (!user.active) {
                return res.status(401).json({ message: "Error. La cuenta se encuentra deshabilitada" })
            }

            if (!user.accountConfirmed) {
                return res.status(401).json({ message: "Error. La cuenta no ha sido confirmada" })
            }

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


    app.post("/api/xusers/clients", async function (req, res, next) {

        let user = req.body

        var u

        try {

            await app.dataSources.db.transaction(async (models) => {

                const { XUser, XRole, Institution } = models

                let institution = await Institution.findById(user.institutionId)

                if (!institution)
                    throw new Error("Error. La institución para la cual se desea crear el usuario no existe");

                let count = await XUser.count({
                    or: [
                        { username: user.username },
                        { email: user.email },
                        { dni: user.dni }
                    ]
                })

                if (count > 0)
                    throw new Error("Error. Ya existe otro usuario con los datos ingresados")

                u = await XUser.create({ ...user, password: `${Math.random()}` })

                let clientRole = await XRole.findOne({ where: { name: "client" } })

                await u.roles.add(clientRole)

                await Institution.updateAll({ id: institution.id }, { userCount: (institution.userCount + 1) })

                let confirmationToken = jwt.sign(
                    { id: u.id, username: u.username },
                    config.secretPassword,
                    { expiresIn: `${config.confirmExpirationInHours}h` }
                )

                await mailingService.send({
                    from: config.mail.sender,
                    to: u.email,
                    subject: config.mail.activationMessage,
                    html: templates.accountActivation({ user: u, token: confirmationToken })
                })


            }, { isolationLevel: app.models.Order.Transaction.REPETEABLE_READ })

            res.json(u)

        } catch (err) {

            res.status(500).json({ message: err.message })

        }

    })

    app.post("/api/xusers/account-confirm", async function (req, res, next) {

        let accountConfirmationInfo = req.body

        try {

            await app.dataSources.db.transaction(async models => {

                const { XUser } = models

                const { username } = jwt.decode(accountConfirmationInfo.token)

                console.log(jwt.decode(accountConfirmationInfo.token))

                let user = await XUser.findOne({ where: { username: username } })

                if (!user)
                    throw new Error("El usuario especificado no existe")

                if (!user.active) {
                    return res.status(401).json({ message: "Error. La cuenta se encuentra deshabilitada" })
                }

                if (user.accountConfirmed)
                    throw new Error("Error. La cuenta ya está activada.")

                try {

                    jwt.verify(accountConfirmationInfo.token, config.secretPassword)

                } catch (err) {

                    throw new Error("Token no válido.")

                }

                await user.setPassword(accountConfirmationInfo.password)
                await user.updateAttributes({
                    accountConfirmed: true
                })


            })

            res.status(201).send()

        } catch (err) {

            res.status(500).json({ message: err.message })

        }

    })

    app.post("/api/password-reset-requests", async function (req, res, next) {

        let email = req.body.email

        try {

            await app.dataSources.db.transaction(async models => {

                const { XUser } = models

                let user = await XUser.findOne({ where: { email: email } })

                if (!user)
                    throw new Error("El usuario especificado no existe")

                if (!user.active) {
                    return res.status(401).json({ message: "Error. La cuenta se encuentra deshabilitada" })
                }

                if (!user.accountConfirmed)
                    throw new Error("No se puede resetear la contraseña. La cuenta no fue confirmada.")

                let resetToken = jwt.sign(
                    { username: user.username },
                    config.secretPassword,
                    { expiresIn: `${config.confirmExpirationInHours}h` }
                )

                await mailingService.send({
                    from: config.mail.sender,
                    to: user.email,
                    subject: config.mail.resetMessage,
                    html: templates.passwordReset({ user: user, token: resetToken })
                })

            })

            res.status(201).send()

        } catch (err) {

            res.status(500).json({ message: err.message })

        }

    })


    app.post("/api/password-reset", async function (req, res, next) {

        let resetInfo = req.body

        try {

            await app.dataSources.db.transaction(async models => {

                const { XUser } = models

                const { username } = jwt.decode(resetInfo.token)

                let user = await XUser.findOne({ where: { username: username } })

                if (!user)
                    throw new Error("El usuario especificado no existe")

                try {

                    jwt.verify(resetInfo.token, config.secretPassword)

                } catch (err) {

                    throw new Error("Token no válido.")

                }

                await user.setPassword(resetInfo.password)

            })

            res.status(201).send()

        } catch (err) {

            res.status(500).json({ message: err.message })

        }

    })


    app.put("/api/xusers/:id/enable", async function (req, res, next) {

        try {

            await app.dataSources.db.transaction(async models => {

                const { XUser } = models

                let u = await XUser.findById(req.params.id)

                await u.enable()

            })

            res.status(200).send()

        } catch (err) {

            res.status(500).json({ message: err.message })

        }


    })

    app.put("/api/xusers/:id/disable", async function (req, res, err) {

        try {

            await app.dataSources.db.transaction(async models => {

                const { XUser } = models

                let u = await XUser.findById(req.params.id)

                await u.disable()

            })

            res.status(200).send()

        } catch (err) {

            res.status(500).json({ message: err.message })

        }


    })


    cb();

}
