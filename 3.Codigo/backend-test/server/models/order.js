'use strict';

module.exports = function (Order) {

    Order.markIfCompleted = function (orderId) {

        const OrderStatus = Order.app.models.OrderStatus

        let completionDate = new Date();

        return Order.findById(orderId, { include: "units" })
            .then((order) => order.toJSON().units.every(u => u.irradiated))
            .then(isCompleted => isCompleted ?
                OrderStatus.find({ where: { name: { regexp: `.*IRRADIADA.*` } } })
                    .then(orderStatus =>
                        Order.updateAll({ id: orderId }, {
                            statusId: orderStatus[0].id, completionDate: completionDate.toISOString()
                        })) : Promise.resolve({ count: 0 }))


    }



};
