// credit goes to https://github.com/okgrow/merge-graphql-schemas for  file_loader.js

const fs = require('fs');
const path = require('path');
const isGlob = require('is-glob');
const Glob = require('glob');

const recursiveReadDirSync = dir =>
    fs.readdirSync(dir)
        .reduce((files, file) => (
                fs.statSync(path.join(dir, file)).isDirectory() ?
                    files.concat(recursiveReadDirSync(path.join(dir, file))) :
                    files.concat(path.join(dir, file))
            ),
            []);

const readDirSync = dir =>
    fs.readdirSync(dir)
        .reduce((files, file) => (
                fs.statSync(path.join(dir, file)).isDirectory() ?
                    files :
                    files.concat(path.join(dir, file))
            ),
            []);

const readGlobSync = (pattern, options) =>
    Glob.sync(pattern, options);

const getSchemaFiles = (dir, recursive, globOptions) => {
    if (isGlob(dir)) {
        return readGlobSync(dir, globOptions);
    }

    if (recursive === true) {
        return recursiveReadDirSync(dir);
    }

    return readDirSync(dir);
};


const file_loader = (folderPath, recursive, globOptions) => {
    const schemafiles = getSchemaFiles(folderPath, recursive, globOptions);

    const files = schemafiles
        .map(f => ({f, pathObj: path.parse(f)}))
        .filter(({pathObj}) => pathObj.name.toLowerCase() !== 'index')
        .map(({f, pathObj}) => {
            return {name: f, contents: fs.readFileSync(f, 'utf8')};
        })
        .filter(v => !!v);    // filter files that we don't know how to handle

    return files;
};

module.exports = file_loader;