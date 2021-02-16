
const fs = require('fs');
const path = require('path');

const defaultGlobalConf = {
    currProject: {
        projectName: '',
        pwd: '',
        currFile: ''
    },
    recent: [
        {
            projectName: 'Test-1',
            pwd: 'C:\\Work\\Privat\\Desktop\\Writer\\TestWorkspace',
            currFile: 'chapter-1'
        },
        {
            projectName: 'Test-2',
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
    projectName: '',
    pwd: '',
    currFile: ''
}

class Config {

#conf = {};

    constructor() {
        this.configure();
    }

    configure() {
        let confPath = path.join(__dirname, 'conf');
        try{
            console.log('Looking for config file in: ', confPath);
            if(fs.existsSync(confPath)){
                console.log('Found conf');
                let cnfg = fs.readFileSync(confPath, 'utf-8');
                this.#conf = JSON.parse(cnfg);
            } else {
                console.log('Conf was not find (else)');
                this.#conf = {...defaultGlobalConf};
            }
        }catch(err){
            console.log('Config constructor: PZDCH');
            this.#conf = {...defaultGlobalConf};
        }
    }

    // Recent projects

    getRecentProjects() {
        return [...this.#conf.recent];
    }

    getRecentProjectByName( prName ) {
        let pr = this.#conf.recent.find((el) => { return el.projectName === prName });
        return {...pr};
    }

    // Curr project

    getCurrProjectSettings() {
        return {...this.#conf.currProject};
    }

    setCurrWorkingProjectName( prname ) {
        this.#conf.currProject.projectName = prname;
    }

    setCurrWorkingFile( filename ) {
        this.#conf.currProject.currFile = filename;
    }

    setCurrWorkingDir( dirname ) {
        this.#conf.currProject.pwd = dirname;
    }

    showConfig() {
        console.log('CONFIG: ', this.#conf);
    }
}




module.exports = new Config();