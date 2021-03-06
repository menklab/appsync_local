const fs = require("fs");
const AWS = require("aws-sdk");
const path = require("path");
const mkdirp = require("mkdirp");
const { StringDecoder } = require('string_decoder');


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

        // loop through each type
        for (let i = 0; i < data.types.length; i++) {
            let t = data.types[i];
            let typePath = path.join(savePath, t.name);
            mkdirp.sync(typePath);

            // write file
            fs.writeFile(path.join(typePath, t.name + ".graphqls"), t.definition, function (err) {
                if (err) {
                    return console.log(err);
                }

                getResolvers(apiId, t.name, typePath)
            });
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

        let resolverPath = path.join(savePath, "resolvers");
        mkdirp.sync(resolverPath);

        // loop through resolvers
        for (let i=0; i<data.resolvers.length; i++) {

            let resolver = data.resolvers[i];

            // write request map
            let requestPath = path.join(resolverPath, resolver.fieldName + ".resolver.request.json.vm");
            fs.writeFile(requestPath, resolver.requestMappingTemplate, function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            // write response map
            let responsePath = path.join(resolverPath, resolver.fieldName + ".resolver.response.json.vm");
            fs.writeFile(responsePath, resolver.responseMappingTemplate, function (err) {
                if (err) {
                    return console.log(err);
                }
            });

            // write config file
            // remove keys that were already written
            resolver.requestMappingTemplate = requestPath;
            resolver.responseMappingTemplate = responsePath;
            fs.writeFile(path.join(resolverPath, resolver.fieldName + ".resolver.config.json"), JSON.stringify(resolver, null, 2), function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }


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

        // for each datasource write it out
        for (let i = 0; i < data.dataSources.length; i++) {
            let source = data.dataSources[i];
            let datasourcePath = path.join(savePath, "datasources");
            mkdirp.sync(datasourcePath);
            // write file
            fs.writeFile(path.join(datasourcePath, source.name + ".ds.json"), JSON.stringify(source, null, 2), function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }

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
        fs.writeFile(path.join(savePath + "./AppSync.json"), JSON.stringify(data.graphqlApi, null, 2), function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });
}