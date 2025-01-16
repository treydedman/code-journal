'use strict';
const data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1,
};
// key for localStorage
const localStorageKey = 'code-journal-data';
// serialize and save to localStorage
function writeData(data) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
}
// load data from localStorage
function loadData() {
  const dataJSON = localStorage.getItem(localStorageKey);
  if (dataJSON) {
    return JSON.parse(dataJSON);
  } else {
    // if no data - initialize default data
    data.entries = [];
    data.nextEntryId = 1;
  }
}
// load the data
loadData();
