const {ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');

const ipc = ipcRenderer;

let confPath = path.join(__dirname, 'conf');

const defaultGlobalConf = {
    currProject: {
        pwd: '',
        currFile: ''
    },
    recent: [
        {
            pwd: 'C:\\Work\\Privat\\Desktop\\Writer\\TestWorkspace',
            currFile: 'chapter-1'
        },
        {
            pwd: 'C:\\Work\\Privat\\Desktop\\Writer\\TestWorkspace-2',
            currFile: 'chapter-2'
        }
    ],
    settings: {
        autosave: {
            enabled: true,
            interval: 300000
        }
    }
};

const defaultProjectConf = {
    pwd: '',
    currFile: ''
}

class Config {

#glConf = {};

    constructor() {
        this.configure();
    }

    configure() {
        try{
            console.log('Looking for config file in: ', confPath);
            if(fs.existsSync(confPath)){
                console.log('Found conf');
                let cnfg = fs.readFileSync(confPath, 'utf-8');
                this.#glConf = JSON.parse(cnfg);
            } else {
                console.log('Conf was not find (else)');
                this.#glConf = {...defaultGlobalConf};
            }
        }catch(err){
            this.#glConf = {...defaultGlobalConf};
        }
    }

    saveConfig() {
        this.updateProjectInRecent();
        try{
            console.log('Saving conf: ', confPath);
            let data = JSON.stringify(this.#glConf, '\n', 2);
            fs.writeFileSync(confPath, data, 'utf-8');
        } catch (e) {
            ipc.send('snakbar:error', e.message || 'Config save error');
        }
    }

    // Recent projects

    getRecentProjects() {
        return [...this.#glConf.recent];
    }

    getRecentProjectByName( prName ) {
        let res = this.#glConf.recent.find((el) => { return (path.basename(el.pwd) === prName) });
        return {...res};
    }

    updateProjectInRecent() {
        let indx = this.#glConf.recent.findIndex((el) => { return el.pwd === this.#glConf.currProject.pwd });
        this.#glConf.recent[indx] = {...this.#glConf.currProject};
    }

    // Curr project

    openProject( dirname ) {
        this.saveConfig();
        this.#glConf.currProject.pwd = dirname;
        let fres = this.#glConf.recent.find((el) => {return el.pwd === dirname});
        if( fres ) {
            this.#glConf.currProject.currFile = fres.currFile;
        } else {
            this.#glConf.currProject.currFile = '';
        }
    }

    getCurrProjectSettings() {
        return {...this.#glConf.currProject};
    }

    setCurrWorkingFile( filename ) {
        this.saveConfig();
        this.#glConf.currProject.currFile = filename;
    }

    showConfig() {
        console.log('CONFIG: ', this.#glConf);
    }
}




module.exports = new Config();