// import entire SDK

const download = require("./download.js");
const program = require('commander');
const fs = require('fs');

let debug = false;


program
    .version('0.1.0')
    .option('--config [config file]', 'Configuration File')
    .option('--verbose', 'Verbosity On');
// .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')

program
    .command('download [path]')
    .description("Download from api to output directory")
    .action(function (env, options) {
        getConfig(program.config, function(config) {
            download(config, env, options);
        })
    });

program
    .command('upload [path]')
    .description("Upload to api from input directory")
    .action(function (env, options) {
        console.log("upload selected");

    });

program
    .parse(process.argv);


if (program.verbose) {
    debug = true;
    console.log("Verbosity On\n");
}

if (program.upload) {
    console.log("upload")
}


function getConfig(path, cb) {

    if (!path) {
        return console.log("Config File Required\n");
    }

    // read file and validate
    let c = JSON.parse(fs.readFileSync(path));
    if (!c.access_key_id || c.access_key_id === "") return console.log("missing 'access_key_id' in config file\n");
    if (!c.secret_access_key || c.secret_access_key === "") return console.log("missing 'secret_access_key' in config file\n");
    if (!c.api_id || c.api_id === "") return console.log("missing 'api_id' in config file\n");
    if (!c.region || c.region === "") return console.log("missing 'region' in config file\n");
    // if (!c.working_directory || c.working_directory === "") return console.log("missing 'working_directory' in config file\n");

   cb(c);
}