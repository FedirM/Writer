
const path          = require('path');
const fs            = require('fs');
const ipc           = require('electron');


function readDir( dirPath ) {
    let files = fs.readdirSync( dirPath ).filter(( elem ) => {return elem.match(/(.*)\.(json)/ig)});

    files = files.map((el) => { return el.replace(/(.*)\.(.*?)$/, "$1")});

    return {
        isEmpty: (files.length === 0) ? true : false,
        list: [...files]
    };
}


module.exports = {
    readDir
};