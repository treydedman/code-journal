const data = {
  view: 'entry-form',
  entries: [] as Entry[],
  editing: null,
  nextEntryId: 1,
};

// key for localStorage
const localStorageKey = 'code-journal-data';

function writeData(data: any): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
}

function loadData(): void {
  const dataJSON = localStorage.getItem(localStorageKey);
  if (dataJSON) {
    return JSON.parse(dataJSON);
  } else {
    data.entries = [];
    data.nextEntryId = 1;
  }
}

loadData();
