
const { ipcRenderer } = require('electron');

const ipc = ipcRenderer;

let autosaveInterval = 300000;

let currWorkingFile = {
    openFilePath: '',
    fileData: {}
};

// Html variables

const FileListHtmlElement = document.getElementById('explorer');


// IPC

ipc.send('explorer:get-list');

ipc.on('explorer:setup-list', (e, fsStats) => {
    // console.log('IPC [explorer:setup-list] ARGS: ', fsStats);
    SetupExplorerList(fsStats);
});


ipc.on('editor:setupFile', (e, data) => {
    // console.log('IPC [editor:setupFile] args: ', data);
    currWorkingFile = {...data};
    setupFile();
});

ipc.on('editor:get-data', saveEditorData);

ipc.on('edito:saveStatus', (e, status) => {
    // console.log('IPC [edito:saveStatus] status: ', isOK);
    showSnakbar(
        `File save ${(status) ? 'complete' : 'fail'}`,
        !status
    );
});

ipc.on('snakbar:error', (e, message) => {
    showSnakbar(message, true);
});

ipc.on('snakbar:message', (e, message) => {
    showSnakbar(message, false);
});

// AUTOSAVE

setInterval(() => {
    saveEditorData( );
}, autosaveInterval);


// FUNCTIONS

function SetupExplorerList(fsStats) {
    FileListHtmlElement.innerHTML = '';
    if(fsStats.isEmpty){
        FileListHtmlElement.insertAdjacentHTML(
            'afterbegin',
            `<h3 style="width: 100%; text-align: center;">
                N/A
            </h3>`
        );
    } else {
        fsStats.list.forEach((el) => {
            FileListHtmlElement.insertAdjacentHTML(
                'beforeend',
                `<div id="${el}" class="file-list-item">${el}</div>`
            );
            document.getElementById(el).addEventListener('click', ExplorerListItemHandler);
        });
    }
}

function ExplorerListItemHandler(event){
    showSnakbar(`Open file ${this.id}.json`);
    let items = document.getElementsByClassName('active-file-list-item');
    for(let el of items) {
        el.classList.remove('active-file-list-item');
    };

    this.classList.add('active-file-list-item');

    ipc.send('explorer:select-list-item', {fileName: this.id});
}

function setupFile(){
    if( !currWorkingFile.fileData || !currWorkingFile.fileData.data ) return;
  
    window.editor.setData( currWorkingFile.fileData.data );
}

function saveEditorData() {
    ipc.send('editor:save', window.editor.getData());
}



function showSnakbar(message, isError = false) {
    Snackbar.show({
        text: message,
        textColor: (isError) ? 'rgb(255, 123, 123)' : '#ffffff',
        pos: 'bottom-right',
        showAction: false,
        // actionText: 'Close',
        // actionTextColor: 'rgba(255, 120, 120, 1)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        duration: 3500
    });
}