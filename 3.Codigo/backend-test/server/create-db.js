var server = require('./server');

server.dataSources.db.automigrate(function (err) {

    if (err)
        throw err;

    ds.disconnect();

});
