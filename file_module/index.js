
const fs = require('fs');
const { dialog } = require('electron');


function readDir( dirPath ) {
    let files = fs.readdirSync( dirPath ).filter(( elem ) => {return elem.match(/(.*)\.(json)/ig)});

    files = files.map((el) => { return el.replace(/(.*)\.(.*?)$/, "$1")});

    return {
        isEmpty: (files.length === 0) ? true : false,
        list: [...files]
    };
}

function readFile( filePath ){
    const jsonFile = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonFile);
}

function saveFile( filePath, data ){
    let fileData = readFile(filePath);
    fileData.data = data;
    fileData = JSON.stringify(fileData);
    console.log('NewestData: ', fileData);

    try{
        fs.writeFileSync(filePath, fileData);
        console.log('Seems all OK');
        return true;
    } catch (e) {
        console.log('Save file failed');
        return false;
    }
}

function createFile( opt ){
    
}

function createProject( opt ){
    //
}

function openDir(){
    return dialog.showOpenDialogSync({ properties: ['openDirectory'] })[0];
}

module.exports = {
    readDir,
    readFile,
    saveFile,
    openDir
};