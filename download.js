const fs = require("fs");
const AWS = require("aws-sdk");
const path = require("path");
const mkdirp = require("mkdirp");

let appsync = {};

module.exports = function (config, env, options) {

    appsync = new AWS.AppSync({
        apiVersion: '2017-07-25',
        region: config.region,
        accessKeyId: config.access_key_id,
        secretAccessKey: config.secret_access_key,
        sessionToken: config.session_token
    });

    // make dir if needed
    mkdirp.sync(env);

    // do download
    getGraphQLInfo(config.api_id, env);
    getDataSources(config.api_id, env);
    getSchema(config.api_id, env);
    getTypes(config.api_id, env);

};

function getTypes(apiId, savePath) {
    // get graph info
    appsync.listTypes({
        apiId: apiId,
        format: "SDL"
    }, function (err, data) {
        if (err) {
            return console.log(err, err.stack);
        }

        for (let i = 0; i < data.types.length; i++) {
            let t = data.types[i];
            getResolvers(apiId, t.name, savePath)
        }
    });
}


function getResolvers(apiId, typeName, savePath) {
    // get graph info
    appsync.listResolvers({
        apiId: apiId,
        typeName: typeName
    }, function (err, data) {
        if (err) {
            return console.log(err, err.stack);
        }

        // skip empty
        if (JSON.stringify(data.resolvers) === "[]") {
            return
        }

        // write file
        fs.writeFile(path.join(savePath + "./" + "resolvers." + typeName + ".json"), JSON.stringify(data.resolvers), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

function getSchema(apiId, savePath) {
    // get graph info
    appsync.getIntrospectionSchema({
        apiId: apiId,
        format: "SDL"
    }, function (err, data) {
        if (err) {
            return console.log(err, err.stack);
        }

        // write file
        fs.writeFile(path.join(savePath + "./Schema.graphql"), data.schema, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}


function getDataSources(apiId, savePath) {
    // get graph info
    appsync.listDataSources({
        apiId: apiId,
    }, function (err, data) {
        if (err) {
            return console.log(err, err.stack);
        }


        // write file
        fs.writeFile(path.join(savePath + "./Datasources.json"), JSON.stringify(data.dataSources), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}

function getGraphQLInfo(apiId, savePath) {
    // get graph info
    appsync.getGraphqlApi({
        apiId: apiId,
    }, function (err, data) {
        if (err) {
            return console.log(err, err.stack);
        }


        // write file
        fs.writeFile(path.join(savePath + "./AppSync.json"), JSON.stringify(data.graphqlApi), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}