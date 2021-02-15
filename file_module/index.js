
const path          = require('path');
const fs            = require('fs');
const ipc           = require('electron');


function readDir( dirPath ) {
    let files = fs.readdirSync( dirPath );

    return {
        isEmpty: (files.length === 0) ? true : false,
        list: [...files]
    };
}


module.exports = {
    readDir
};