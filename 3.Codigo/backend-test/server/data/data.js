
module.exports.users = [
    { email: 'user1@dummy.com', dni: 30123323, username: "operador", password: 'garrahan', firstname: "Juan", lastname: "Perez", isInternal: true, initials: 'JUP' },
    { email: 'user2@dummy.com', dni: 30123343, username: "administrador", password: 'garrahan', firstname: "Jimena", lastname: "Perez", isInternal: true, initials: 'JP' },
    { email: 'user3@dummy.com', dni: 30123325, username: "cliente1", password: 'garrahan', firstname: "Pedro", lastname: "Fernandez", isInternal: false },
    { email: 'user4@dummy.com', dni: 30123326, username: "cliente2", password: 'garrahan', firstname: "Juan", lastname: "Fernandez", isInternal: false },
];

module.exports.roles = [
    { name: "operator", description: "Operadores técnicos del Banco de Sangre" },
    { name: "admin", description: "Administradores del Banco de Sangre" },
    { name: "client", description: "Usuarios externos al Banco" }
]



module.exports.unitTypes = [
    { code: "AFR", name: "Aféresis", billingDivider: 2 },
    { code: "GRN", name: "Granulocitos", billingDivider: 1 },
    { code: "CP", name: "Plaquetas", billingDivider: 4 },
    { code: "CGR", name: "Globulos Rojos", billingDivider: 1 },
    { code: "OTRO", name: "Tipo de hemocomponente no identificado", billingDivider: 1 }
]

module.exports.orderPriorities = [
    { name: "NORMAL", description: "Prioridad simple" },
    { name: "URGENTE", description: "Órdenes urgentes" }
]

module.exports.institutionTypes = [
    { name: "PÚBLICA", description: "Instituciones públicas de salud" },
    { name: "PRIVADA", description: "Instituciones privadas de salud" },
    { name: "UBA", description: "Instituciones de salud dependientes de la Universidad de Buenos Aires" },
    { name: "Ins. Prov. Bs As", description: "Instituciones en Provincia de Buenos Aires" }
]

module.exports.orderStatuses = [
    {
        name: "EN_PROCESO",
        description: "Órdenes que fueron aceptadas y pueden ser irradiadas o bien están siendo irradiadas."
    },
    {
        name: "RECHAZADA",
        description: "Órdenes que fueron rechazadas por algún operador y deben ser revisadas/conciliadas por el cliente."
    },
    {
        name: "PENDIENTE",
        description: "Órdenes recién ingresadas, ó recientemente revisadas y modificadas por el cliente. Deben ser aceptadas o rechazadas."
    },
    {
        name: "IRRADIADA",
        description: "Órdenes que ya fueron irradiadas en forma completa."
    },
    {
        name: "CANCELADA",
        description: "Órdenes canceladas por los clientes. No son tenidas en cuenta para futuras revisiones ni irradiaciones."
    }
]

module.exports.institutions = [{
    "name": "Fuhesa",
    "email": "agodson0@squidoo.com",
    "address": "73 Crownhardt Crossing"
}, {
    "name": "Abete",
    "email": "cabbys1@twitpic.com",
    "address": "1147 Blue Bill Park Place"
}, {
    "name": "Alvarez",
    "email": "kdorsey2@typepad.com",
    "address": "693 Autumn Leaf Court"
}, {
    "name": "Argerich",
    "email": "kloutheane3@com.com",
    "address": "61 4th Way"
}, {
    "name": "Britanico",
    "email": "eminihan4@harvard.edu",
    "address": "906 Sachs Street"
}, {
    "name": "Carrillo",
    "email": "cseaborn5@squidoo.com",
    "address": "4292 Kedzie Junction"
}, {
    "name": "Clinicas",
    "email": "bcritoph6@creativecommons.org",
    "address": "9239 7th Court"
}, {
    "name": "Durand",
    "email": "bcattenach7@usgs.gov",
    "address": "36 Elgar Center"
}, {
    "name": "Elizalde",
    "email": "fbimrose8@nba.com",
    "address": "02756 Washington Alley"
}, {
    "name": "Eurnekian",
    "email": "mhills9@uiuc.edu",
    "address": "3799 Melrose Avenue"
}, {
    "name": "Eva Peron San Martin",
    "email": "rmillichipa@google.es",
    "address": "479 Amoth Junction"
}]
