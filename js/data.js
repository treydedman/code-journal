'use strict';
const data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1,
};
// key for localStorage
const localStorageKey = 'code-journal-data';
function writeData(data) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
}
function loadData() {
  const dataJSON = localStorage.getItem(localStorageKey);
  if (dataJSON) {
    return JSON.parse(dataJSON);
  } else {
    data.entries = [];
    data.nextEntryId = 1;
  }
}
loadData();
