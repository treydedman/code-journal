// interface for entry object
interface Entry {
  entryID: number;
  title: string;
  imgUrl: string;
  notes: string;
}

// interface for data object
interface Data {
  view: string;
  entries: Entry[];
  editing: Entry | null;
  nextEntryId: number;
}

// key for localStorage
const localStorageKey = 'code-journal-data';

// serialize and save to localStorage
function writeData(): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
}

// load data from localStorage
function loadData(): Data {
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
