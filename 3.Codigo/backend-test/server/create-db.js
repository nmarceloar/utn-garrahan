var server = require('./server');

var ds = server.dataSources.db;


ds.automigrate(function(err) {

	if (err) 
		throw err;

	ds.disconnect();

	

});