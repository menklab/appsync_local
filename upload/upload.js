const AWS = require("aws-sdk");
const path = require("path");
const {fileLoader, mergeTypes} = require('merge-graphql-schemas');
const uploadDatasources = require("./datasources");
const uploadResolvers = require("./resolvers");

let appsync = {};

module.exports = function (config, env, options) {

    appsync = new AWS.AppSync({
        apiVersion: '2017-07-25',
        region: config.region,
        accessKeyId: config.access_key_id,
        secretAccessKey: config.secret_access_key,
        sessionToken: config.session_token
    });

    // merge schema
    let importPath = path.join(env, "/**/*.graphqls");
    let typesArray = fileLoader(importPath);
    let schema = mergeTypes(typesArray);

    // upload schema
    uploadSchema(config.api_id, schema, function () {
        uploadDatasources(config.api_id, env, appsync);
        uploadResolvers(config.api_id, env, appsync);
    });

};


function uploadSchema(apiId, schema, cb) {
    // appsync.startSchemaCreation({
    //     apiId: apiId,
    //     definition: schema
    // }, function(err, data) {
    //     if (err) return console.log(err, err.stack);
    //
    //     getSchemaCreationStatus(apiId, function() {
    //         cb();
    //     })
    //
    // });
    cb();
}

function getSchemaCreationStatus(apiId, cb) {

    appsync.getSchemaCreationStatus({
        apiId: apiId
    }, function (err, data) {
        if (err) return console.log(err, err.stack);

        if (data.status === "PROCESSING") {
            console.log("PROCESSING");
            setTimeout(function () {
                getSchemaCreationStatus(apiId, cb);
            }, 1000)
        } else if (data.status === "DELETING") {
            console.log("DELETING");
            setTimeout(function () {
                getSchemaCreationStatus(apiId, cb);
            }, 1000)
        } else {
            cb()
        }
    });

}