
const mysql = require("mysql")

const ds = require("./datasources.json")

const connection = mysql.createConnection({
    host: ds.db.host,
    port: ds.db.port,
    user: ds.db.user,
    password: ds.db.password
})

connection.connect(function (err) {

    if (err)
        throw err

    connection.query(`create database if not exists ${ds.db.database}`, function (err) {

        if (err)
            throw err

        connection.end(function (err) {

            if (err)
                throw err

        })


    })

})
