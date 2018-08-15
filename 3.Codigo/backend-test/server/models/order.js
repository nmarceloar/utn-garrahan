'use strict';

module.exports = function (Order) {

    Order.markIfCompleted = function (orderId) {

        const OrderStatus = Order.app.models.OrderStatus

        return Order.findById(orderId, { include: "units" })
            .then((order) => order.toJSON().units.every(u => u.irradiated))
            .then(isCompleted => isCompleted ?
                OrderStatus.find({ where: { name: { regexp: `.*IRRADIADA.*` } } })
                    .then(orderStatus =>
                        Order.updateAll({ id: orderId }, { statusId: orderStatus[0].id })) : Promise.resolve({ count: 0 }))

    }



};
