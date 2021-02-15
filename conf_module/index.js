
const fs = require('fs');
const path = require('path');

const defaultConf = {
    last_project: '',
    recent: []
};

function configure() {
    let confPath = path.join(__dirname, 'conf');
    try{
        console.log('Looking for config file in: ', confPath);
        if(fs.existsSync(confPath)){
            console.log('Found conf');
        }
    }catch(err){
        console.log('Conf was not find');
    }
}


module.exports = {
    configure
}