

var app = require("./server")

function App() { }

App.createProject = async function (project) {

    var p

    await app.dataSources.db.transaction(async (models) => {

        p = await models.Project.create(project)

        await models.Manager.updateAll(
            { id: p.managerId },
            { projectCount: await models.Project.count({ managerId: p.managerId }) }
        )

        await models.Project.count()

    })

    return p;

}

module.exports.App = App; 
