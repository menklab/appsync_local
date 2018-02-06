// import entire SDK
const AWS = require("aws-sdk");


let appsync = new AWS.AppSync({apiVersion: '2017-07-25'});
let download = require("./download.js");

const program = require('commander');

let debug = false;

program
    .version('0.1.0')
    .option('-id, --apiId [api_id]', 'Api Id')
    .option('-v, --verbose', 'Verbosity On');
// .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')

program
    .command('download [path]')
    .description("Download from api to output directory")
    .action(function (env, options) {
        if (!env) {
            console.log("Path is required!\n");
            return
        }
        download(env, options)
    });

program
    .command('upload [path]')
    .description("Upload to api from input directory")
    .action(function (env, options) {
        console.log("upload selected");

    });

program
    .parse(process.argv);


if (!program.apiId) {
    console.log("Api Id Required\n");
    return
}

if (program.verbose) {
    debug = true;
    console.log("Verbosity On\n");
}

if (program.upload) {
    console.log("upload")
}
