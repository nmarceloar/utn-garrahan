'use strict';

module.exports = async (app, cb) => {

    app.dataSources.db.setMaxListeners(Object.keys(app.models).length)

	await app.datasources.db.automigrate() 

	cb() 

};
