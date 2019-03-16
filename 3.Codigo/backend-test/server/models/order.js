'use strict';

module.exports = function (Order) {

    Order.prototype.validTransitions = [
        { from: 'PENDIENTE', to: 'RECHAZADA' },
        { from: 'PENDIENTE', to: 'EN_PROCESO' }
    ]

    Order.prototype.markAs = async function (orderStatus) {

        let currentStatus = await this.status.get()

        let isValid = this.validTransitions
            .some(vt => vt.from === currentStatus.name && vt.to === orderStatus.name)

        if (!isValid)
            throw new Error(`No se puede pasar una orden en estado ${currentStatus.name} al estado ${orderStatus.name}`)

        return this.updateAttributes({ statusId: orderStatus.name })

    }


    Order.markIfCompleted = async function (orderId) {

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
