const fs = require("fs");
const jsonFileLoader = require('../file-loader');
const path = require("path");


function uploadDatasources(apiId, env, appsync) {
    // get data sources
    let datasourcePath = path.join(env, "/**/*.ds.json");
    let datasourceArray = jsonFileLoader(datasourcePath);

    // for each datasource
    for (let i=0; i< datasourceArray.length; i++) {

        // parse json
        let ds = datasourceArray[i];
        let dsC = JSON.parse(ds.contents);

        // if there is a dsArn then try to update
        if (dsC.dataSourceArn) {
            dsC.apiId = apiId;
            delete dsC.dataSourceArn;
            appsync.updateDataSource(dsC, function(err, newContents) {
                if (err) return console.log(err, err.stack);

                // write out new file on success
                fs.writeFile(ds.name, JSON.stringify(newContents.dataSource, null, 2), function (err) {
                    if (err) {
                        return console.log(err, err.stack);
                    }
                });
            });
        }
        // otherwise create new
        else {
            dsC.apiId = apiId;
            appsync.createDataSource(dsC, function(err, newContents) {
                if (err) return console.log(err, err.stack);

                // write out new file on success
                fs.writeFile(ds.name, JSON.stringify(newContents.dataSource, null, 2), function (err) {
                    if (err) {
                        return console.log(err, err.stack);
                    }
                });
            });
        }
    }

}

module.exports = uploadDatasources;