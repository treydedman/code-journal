// Interface for entry
interface Entry {
  entryID: number;
  title: string;
  imgUrl: string;
  notes: string;
}

// the viewSwap function to manage different views in the app
function viewSwap(viewName: string): void {
  // Hide all views
  const views = document.querySelectorAll('[data-view]');
  for (let i = 0; i < views.length; i++) {
    views[i].classList.add('hidden');
  }

  const activeView = document.querySelector(`[data-view="${viewName}"]`);
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  // hide the navbar in the 'entry-form' view
  const navbar = document.querySelector('#navbar');
  if (viewName === 'entry-form') {
    navbar?.classList.add('hidden'); // Hide navbar when on the new entry form
  } else {
    navbar?.classList.remove('hidden'); // Show navbar for other views
  }

  // update current view
  data.view = viewName;
  writeData(); // Save the data to localStorage

  // switch toggleNoEntries message
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

// check for query errors
if (!$form) throw new Error('$form query failed');
if (!$imgPreview) throw new Error('$imgPreview query failed');
if (!$imgUrlInput) throw new Error('$imgUrlInput query failed');
if (!$titleInput) throw new Error('$titleInput query failed');
if (!$notesInput) throw new Error('$notesInput query failed');

// add event listeners for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Show the view that was previously active before the page refresh
  const previousView = data.view || 'entries';
  viewSwap(previousView);
  toggleNoEntries();

  // add event listener for the "New" button to show the entry form
  const newEntryButton = document.getElementById('view-new-entry-link')!;
  newEntryButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default action (link behavior)
    viewSwap('entry-form'); // Switch to the new entry form view
  });

  // entries on load
  const entriesList = document.querySelector(
    '[data-view="entries"] ul',
  ) as HTMLUListElement;

  // loop through the entries in data and append them to the entries list
  for (let i = 0; i < data.entries.length; i++) {
    const entry = data.entries[i];
    const entryLi = renderEntry(entry);
    entriesList.appendChild(entryLi);
  }

  // check if entries exist to toggle the "no entries" message
  toggleNoEntries();
});

// renderEntry function to create the DOM tree
function renderEntry(entry: Entry): HTMLLIElement {
  const li = document.createElement('li');
  // adding classes for layout
  li.classList.add('row', 'entry');

  // image section to add column-half
  const imgColumn = document.createElement('div');
  imgColumn.classList.add('column-half');
  const img = document.createElement('img');
  img.src = entry.imgUrl || './images/placeholder-image-square.jpg';
  // use the title as the alt text
  img.alt = entry.title;
  img.classList.add('img-placeholder');
  imgColumn.appendChild(img);

  // title and notes (column-half)
  const textColumn = document.createElement('div');
  textColumn.classList.add('column-half');
  const title = document.createElement('h2');
  title.textContent = entry.title;
  const notes = document.createElement('p');
  notes.textContent = entry.notes;

  textColumn.appendChild(title);
  textColumn.appendChild(notes);

  // append both image and text columns to the list element
  li.appendChild(imgColumn);
  li.appendChild(textColumn);

  return li;
}

// toggleNoEntries function to show or hide the "no entries" message
function toggleNoEntries(): void {
  const noEntriesMessage = document.querySelector(
    '[data-view="entries"] .no-entries',
  ) as HTMLElement;

  if (data.entries.length === 0) {
    noEntriesMessage.classList.remove('hidden');
  } else {
    noEntriesMessage.classList.add('hidden');
  }
}

// update form submit event handler for new entry
$form.addEventListener('submit', (event) => {
  event.preventDefault();

  // create a new entry object
  const newEntry: Entry = {
    entryID: data.nextEntryId,
    title: $titleInput.value,
    imgUrl: $imgUrlInput.value,
    notes: $notesInput.value,
  };

  // increment entry ID for next submission
  data.nextEntryId++;

  // add the new entry to the array of entries
  data.entries.unshift(newEntry);

  // render and prepend the new entry to the entries list
  const entriesList = document.querySelector(
    '[data-view="entries"] ul',
  ) as HTMLUListElement;
  const newEntryLi = renderEntry(newEntry);
  entriesList.prepend(newEntryLi);

  // display the "entries" view
  viewSwap('entries');

  // toggle "no entries" message
  toggleNoEntries();

  // save updated data to localStorage
  writeData();

  // clear and reset the form
  $form.reset();
});
