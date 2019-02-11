'use strict';

module.exports = function (Institution) {

    Institution.increaseOrderCount = async function (institutionId) {

        let q = `update institution set orderCount = orderCount + 1 where id=${institutionId}`

        return new Promise((resolve, reject) => {

            Institution.dataSource.connector.query(q, function (err, data) {
                if (err)
                    reject(err)
                else
                    resolve(data)
            })

        })


    }

    Institution.increaseUserCount = async function (institutionId) {

        let q = `update institution set userCount = userCount + 1 where id=${institutionId}`

        return new Promise((resolve, reject) => {

            Institution.dataSource.connector.query(q, function (err, data) {
                if (err)
                    reject(err)
                else
                    resolve(data)
            })

        })


    }

};
