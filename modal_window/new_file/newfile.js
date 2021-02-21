
const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

let tagList = [];
let selectedTagList = [];

tagList = [
  'Custom',
  'Support',
  'Base',
  'Blog'
];

let FullList = document.getElementById("full");
let SelectedList = document.getElementById('selected');

function init() {
  console.log('Init script');
  FullList.innerHTML = '';
  SelectedList.innerHTML = '';
  for(let tag of tagList){
    if( selectedTagList.indexOf(tag) === -1 ){
      FullList.insertAdjacentHTML("beforeend", `<div id="${tag}" class="item">${tag}</div>`);
      document.getElementById(tag).addEventListener('click', selectItem);
    }
  }

  for(let tag of selectedTagList){
    SelectedList.insertAdjacentHTML("beforeend", `<div id="${tag}" class="item">${tag}</div>`);
    document.getElementById(tag).addEventListener('click', refuseItem);
  }
}

function searchFilter() {
  let inputValue = document.getElementById("searchLine").value.toLowerCase();
  let list = FullList.getElementsByClassName('item');
  for(let i = 0; i < list.length; i++){
    let textValue = list[i].textContent || list[i].innerText;
    if( textValue.toLowerCase().indexOf(inputValue) !== -1 ){
      list[i].style.display = '';
    } else {
      list[i].style.display = 'none';
    }
  }
}

function selectItem(event) {
  selectedTagList.push(event.path[0].id);
  document.getElementById(event.path[0].id).remove();
  SelectedList.insertAdjacentHTML("beforeend", `<div id="${event.path[0].id}" class="item">${event.path[0].id}</div>`);
  document.getElementById(event.path[0].id).addEventListener('click', refuseItem);
}

function refuseItem(event) {
  selectedTagList.splice( selectedTagList.indexOf(event.path[0].id), 1 );
  document.getElementById(event.path[0].id).remove();
  FullList.insertAdjacentHTML("beforeend", `<div id="${event.path[0].id}" class="item">${event.path[0].id}</div>`);
  document.getElementById(event.path[0].id).addEventListener('click', selectItem);
}

function addNewTag() {
  let value = document.getElementById('newTagLine').value;
  console.log('Add tag: ', value);
}

function validateFileName( name ){
  console.log('Name: ', name);
  if( name.length > 0 && name.indexOf('.json') === -1 ) return name + '.json';
  return name;
}

function save() {
  let response = {};
  response.fileName = validateFileName(document.getElementById('input-filename').value);
  console.log('FILENAME: ', response.fileName);
  if( response.fileName.length === 0 ) return ipc.send('snakbar:error', 'You should specify filename');
  response.tags = [...selectedTagList];
  ipc.send('newfile:close-window-save', {...response});
}

// IPC

ipc.send('newfile:get-tag-list');
ipc.on('newfile:on-get-tag-list', (event, list) => {
  tagList = [...list];
  console.log('LIST: ', tagList);
});

