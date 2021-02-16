const { 
  BrowserWindow,
  Menu,
  ipcMain,
  app
}                   = require('electron');

const path          = require('path');

const config        = require('./conf_module/.');
const fileModule    = require('./file_module/.');

const ipc = ipcMain;
const testDir = path.join(__dirname, 'TestWorkspace');

config.setCurrWorkingDir( testDir );

let mainWindow;

function createWindow() {
  config.showConfig();
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed',  () => {
    quit();
    mainWindow = null
  });


  createNewFileModal();
}

function createNewFileModal() {
  let modal = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    resizable: false,
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  modal.loadFile('./modal_window/new_file/newfile.html');
  modal.webContents.openDevTools();
  modal.on('closed',  () => {modal = null});
}

function createMenu() {
  const recentProjects = config.getRecentProjects().map((el) => {
    return { label: el.projectName, click: openRecentProject }
  });
  const menuTempl = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          click: () => { console.log('New file') }
        },
        {
          label: 'New Project',
          click: () => { console.log('New Project') }
        },
        {
          type: 'separator'
        },
        {
          label: 'Open Project',
          click: openProject
        },
        {
          label: 'Open Recent',
          submenu: [...recentProjects]
        },
        {
          type: 'separator'
        },
        {
          label: 'Save File',
          click: saveCurrFile
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          click: quit
        }
      ]
    }
  ];


  const menu = Menu.buildFromTemplate( menuTempl );
  Menu.setApplicationMenu( menu );
}

function openProject() {
  config.setCurrWorkingDir( fileModule.openDir() );
  readProjectFiles();
}

function openRecentProject(menuItem) {
  let conf = config.getRecentProjectByName( menuItem.label );
  config.setCurrWorkingProjectName( conf.projectName );
  config.setCurrWorkingFile( conf.currFile );
  config.setCurrWorkingDir( conf.pwd );
  readProjectFiles();
  openCurrFile();
}

function openCurrFile() {
  let res = {};
  res.openFilePath =path.join(
    config.getCurrProjectSettings().pwd,
    config.getCurrProjectSettings().currFile + '.json'
  );
  res.fileData = fileModule.readFile(res.openFilePath);
  mainWindow.webContents.send('editor:setupFile', {...res});
}

function saveCurrFile() {
  mainWindow.webContents.send('editor:get-data');
}

function readProjectFiles() {
  console.log('ReadProjectFiles conf: ', config.getCurrProjectSettings());
  mainWindow.webContents.send(
    'explorer:setup-list',
    fileModule.readDir(config.getCurrProjectSettings().pwd)
  );
}



function quit() {

  //TODO save app state
  app.quit();
}


app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow()
});

// IPC

ipc.on('explorer:get-list', (event) => {
    // console.log('IPC MAIN [explorer:get-list]');
    readProjectFiles();
    //event.reply( 'explorer:setup-list', fileModule.readDir(testDir) );
});

ipc.on('explorer:select-list-item', (event, data) => {
  // console.log('IPC MAIN [explorer:select-list-item] data: ', data);
  config.setCurrWorkingFile( data.fileName );
  openCurrFile();
});

ipc.on('editor:save', (event, data) => {
  let projectSettings = config.getCurrProjectSettings();
  if( !projectSettings.currFile || !projectSettings.pwd ) return;
  // console.log('IPC MAIN [editor:save] data: ', data);
  event.reply(
    'edito:saveStatus',
    fileModule.saveFile(
      path.join(projectSettings.pwd, projectSettings.currFile + '.json'),
      data
    )
  );
});