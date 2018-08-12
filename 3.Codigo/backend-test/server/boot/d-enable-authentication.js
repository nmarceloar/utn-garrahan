'use strict';

module.exports = function (app, cb) {

	app.enableAuth({
		datasource: "db"
	});

	cb()

};
