
const api = 'http://localhost:3000/api'

export const environment = {

    production: false,
    api: {
        login: `${api}/xusers/login`,
        users: `${api}/xusers`,
        orders: `${api}/orders`,
        institutions: `${api}/institutions`,
        orderStatus: `${api}/orderstatus`,
        orderPriorities: `${api}/order-priorities`
    },
    storage: sessionStorage,
    sessionAlertOffsetInMin: 1

};
