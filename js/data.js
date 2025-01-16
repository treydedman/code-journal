'use strict';
// key for localStorage
const localStorageKey = 'code-journal-data';
// serialize and save to localStorage
function writeData() {
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
    return {
      view: 'entry-form',
      entries: [],
      editing: null,
      nextEntryId: 1,
    };
  }
}
// load the data
const data = loadData();
