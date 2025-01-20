'use strict';
const localStorageKey = 'code-journal-data';
function writeData() {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
}
function loadData() {
  const dataJSON = localStorage.getItem(localStorageKey);
  if (dataJSON) {
    return JSON.parse(dataJSON);
  } else {
    return {
      view: 'entries',
      entries: [],
      editing: null,
      nextEntryId: 1,
    };
  }
}
const data = loadData();
