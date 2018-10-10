'use strict';


module.exports = function (Project) {

    Project.validatesUniquenessOf("name", "description");

};
