
const api = 'http://localhost:3000/api'

export const environment = {

    production: false,
    api: {
        login: `${api}/xusers/login`,
        verifyCredentials: `${api}/xusers/verifyCredentials`,
        users: `${api}/xusers`,
        orders: `${api}/orders`,
        institutions: `${api}/institutions`,
        orderStatus: `${api}/orderstatus`,
        orderPriorities: `${api}/order-priorities`,
        unitTypes: `${api}/unit-types`
    },
    storage: sessionStorage,
    sessionAlertOffsetInMin: 1

};
