const fs = require("fs");
const jsonFileLoader = require('../file-loader');
const path = require("path");


function uploadResolvers(apiId, env, appsync) {
    // get data sources
    let resolverPath = path.join(env, "/**/*.resolver.config.json");
    let resolverArray = jsonFileLoader(resolverPath);
    // for each resolver
    for (let i=0; i< resolverArray.length; i++) {

        // parse json
        let r = resolverArray[i];
        let rC = JSON.parse(r.contents);
        
        // load resolver request contents
        rC.requestMappingTemplate = fs.readFileSync(rC.requestMappingTemplate).toString('utf8');
        rC.responseMappingTemplate = fs.readFileSync(rC.responseMappingTemplate).toString('utf8');

        // if there is a rArn then try to update
        if (rC.resolverArn) {
            console.log("updating resolver: ", rC.fieldName);
            rC.apiId = apiId;
            delete rC.resolverArn;
            appsync.updateResolver(rC, function(err, newContents) {
                if (err) return console.log(err, err.stack);
                // write out new file on success
                write3PartFile(r.name, newContents.resolver);
            });
        }
        // otherwise create new
        else {
            console.log("creating resolver: ", rC.fieldName);
            rC.apiId = apiId;
            appsync.createResolver(rC, function(err, newContents) {
                if (err) return console.log(err, err.stack);
                write3PartFile(r.name, newContents.resolver);
            });
        }
    }

}

function write3PartFile(resolverPath, resolver) {
    let fileTemplatePath = resolverPath.replace(".config.json", "");

    // write request map
    let requestPath = fileTemplatePath + ".request.json.vm";
    fs.writeFile(requestPath, resolver.requestMappingTemplate, function (err) {
        if (err) {
            return console.log(err);
        }
    });

    // write response map
    let responsePath = fileTemplatePath + ".response.json.vm";
    fs.writeFile(responsePath, resolver.responseMappingTemplate, function (err) {
        if (err) {
            return console.log(err);
        }
    });

    // write config file
    // remove keys that were already written
    resolver.requestMappingTemplate = requestPath;
    resolver.responseMappingTemplate = responsePath;
    fs.writeFile(path.join(resolverPath), JSON.stringify(resolver, null, 2), function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = uploadResolvers;