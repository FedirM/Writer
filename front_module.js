
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
    let items = document.getElementsByClassName('active-file-list-item');
    for(let el of items) {
        el.classList.remove('active-file-list-item');
    };

    this.classList.add('active-file-list-item');

    ipc.send('explorer:select-list-item', {fileName: this.id});
}