
const api = 'http://localhost:3000/api'

export const environment = {

    production: false,
    api: {
        login: `${api}/xusers/login`,
        verifyCredentials: `${api}/xusers/verifyCredentials`,
        users: `${api}/xusers`,
        orders: `${api}/orders`,
        dailyReport: `${api}/orders/dailyReport`,
        monthlyReport: `${api}/orders/monthlyReport`,
        institutions: `${api}/institutions`,
        institutionTypes: `${api}/institutionTypes`,
        orderStatus: `${api}/orderstatus`,
        orderPriorities: `${api}/order-priorities`,
        unitTypes: `${api}/unit-types`
    },
    storage: sessionStorage,
    sessionAlertOffsetInMin: 2

};
