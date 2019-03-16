
var nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: "irradgarrahan@gmail.com",
        pass: "passwordV1.0"
    }

});



module.exports = {

    send: function (mailInfo, cb) {

        return new Promise((resolve, reject) => {

            transporter.sendMail(mailInfo, function (err, info) {

                if (err)
                    reject(err)
                else
                    resolve(info)

            });

        })

    }
}

