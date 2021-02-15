
const path          = require('path');
const fs            = require('fs');


const workingDir = path.join(__dirname, 'TestWorkspace');


function readWorkingDir() {
    let files = fs.readdirSync( workingDir );

    return {
        isEmpty: (files.length === 0) ? true : false,
        list: [...files]
    };
}


module.exports = {
    readWorkingDir
};