// interface for Entry
interface Entry {
  entryID: number;
  title: string;
  imgUrl: string;
  notes: string;
}

// viewSwap function
function viewSwap(viewName: string): void {
  const views = document.querySelectorAll('[data-view]');
  for (let i = 0; i < views.length; i++) {
    views[i].classList.add('hidden');
  }

  const activeView = document.querySelector(`[data-view="${viewName}"]`);
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  data.view = viewName;
  writeData();

  if (viewName === 'entries') {
    toggleNoEntries();
  }
}

// query for DOM elements
const $form = document.querySelector('form') as HTMLFormElement;
const $imgPreview = document.querySelector(
  '.img-placeholder',
) as HTMLImageElement;
const $imgUrlInput = document.getElementById('url') as HTMLInputElement;
const $titleInput = document.getElementById('title') as HTMLInputElement;
const $notesInput = document.getElementById('notes') as HTMLTextAreaElement;

// checkk for query errors
if (!$form || !$imgPreview || !$imgUrlInput || !$titleInput || !$notesInput) {
  throw new Error('query failed: missing DOM element');
}

$form.addEventListener('submit', (event) => {
  event.preventDefault();

  // create a new entry
  const newEntry: Entry = {
    entryID: data.nextEntryId,
    title: $titleInput.value,
    imgUrl: $imgUrlInput.value,
    notes: $notesInput.value,
  };

  // increment entry ID
  data.nextEntryId++;

  // add the new entry to the array
  data.entries.unshift(newEntry);

  // render the new entry in the list
  const entriesList = document.querySelector(
    '[data-view="entries"] ul',
  ) as HTMLUListElement;
  const newEntryLi = renderEntry(newEntry);
  entriesList.prepend(newEntryLi);

  // display the entries view
  viewSwap('entries');

  // update the "no entries" message visibility
  toggleNoEntries();

  // save the updated data
  writeData();

  // clear and reset the form
  $form.reset();

  // reset the image preview
  $imgPreview.src = './images/placeholder-image-square.jpg';
  $imgPreview.alt = 'Preview image';
});

// render entry function
function renderEntry(entry: Entry): HTMLLIElement {
  const li = document.createElement('li');
  li.classList.add('row', 'entry');

  // image
  const imgColumn = document.createElement('div');
  imgColumn.classList.add('column-half');
  const img = document.createElement('img');
  img.src = entry.imgUrl || './images/placeholder-image-square.jpg';
  img.alt = entry.title;
  img.classList.add('img-placeholder');
  imgColumn.appendChild(img);

  // Title and Notes section
  const textColumn = document.createElement('div');
  textColumn.classList.add('column-half');
  const title = document.createElement('h2');
  title.textContent = entry.title;
  const notes = document.createElement('p');
  notes.textContent = entry.notes;

  textColumn.appendChild(title);
  textColumn.appendChild(notes);

  // append both image and text columns
  li.appendChild(imgColumn);
  li.appendChild(textColumn);

  return li;
}

// toggleNoEntries function
function toggleNoEntries(): void {
  const noEntriesMessage = document.querySelector(
    '#no-entries-message',
  ) as HTMLElement;

  if (data.entries.length === 0) {
    noEntriesMessage.classList.remove('hidden');
  } else {
    noEntriesMessage.classList.add('hidden');
  }
}

// add event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Show the previously active view
  const previousView = data.view || 'entries';
  viewSwap(previousView);

  // add event listener to the "New Entry" button
  const newEntryButton = document.getElementById('new-entry-btn')!;
  newEntryButton.addEventListener('click', (event) => {
    event.preventDefault();
    viewSwap('entry-form');
  });

  // image preview
  $imgUrlInput.addEventListener('input', () => {
    const url = $imgUrlInput.value;
    // only update the image if the URL is valid
    if (url) {
      $imgPreview.src = url;
      $imgPreview.alt = 'Preview image';
    }
  });

  // render existing entries on load
  const entriesList = document.querySelector(
    '[data-view="entries"] ul',
  ) as HTMLUListElement;
  data.entries.forEach((entry) => {
    const entryLi = renderEntry(entry);
    entriesList.appendChild(entryLi);
  });

  // toggle "no entries" message
  toggleNoEntries();
});
