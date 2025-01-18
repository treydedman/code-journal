interface Entry {
  entryID: number;
  title: string;
  imgUrl: string;
  notes: string;
}

interface Data {
  view: string;
  entries: Entry[];
  editing: Entry | null;
  nextEntryId: number;
}

const localStorageKey = 'code-journal-data';

function writeData(): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(localStorageKey, dataJSON);
}

function loadData(): Data {
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
