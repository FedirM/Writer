
const { ipcRenderer } = require('electron');

const ipc = ipcRenderer;

// Html variables

const FileListHtmlElement = document.getElementById('explorer');


// IPC

ipc.send('explorer:get-list');

ipc.on('explorer:setup-list', (e, fsStats) => {
    console.log('IPC [explorer:setup-list] ARGS: ', fsStats);
    SetupExplorerList(fsStats);
});



// FUNCTIONS

function SetupExplorerList(fsStats) {
    if(fsStat.isEmpty){
        FileListHtmlElement.insertAdjacentHTML(
            'afterbegin',
            `<h3 style="width: 100%; text-align: center;">
                N/A
            </h3>`
        );
    } else {
        fsStat.list.forEach((el) => {
            FileListHtmlElement.insertAdjacentHTML(
                'beforeend',
                `<div id="${el}" class="file-list-item">${el}</div>`
            );
        });
    }
}