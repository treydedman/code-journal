'use strict';
// viewSwap function
function viewSwap(viewName) {
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
const $form = document.querySelector('form');
const $imgPreview = document.querySelector('.img-placeholder');
const $imgUrlInput = document.getElementById('url');
const $titleInput = document.getElementById('title');
const $notesInput = document.getElementById('notes');
// check for query errors
if (!$form || !$imgPreview || !$imgUrlInput || !$titleInput || !$notesInput) {
  throw new Error('query failed: missing DOM element');
}
// render entry function
function renderEntry(entry) {
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
function toggleNoEntries() {
  const noEntriesMessage = document.querySelector('#no-entries-message');
  if (data.entries.length === 0) {
    noEntriesMessage.classList.remove('hidden');
  } else {
    noEntriesMessage.classList.add('hidden');
  }
}
// handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  // create a new entry
  const newEntry = {
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
  const entriesList = document.querySelector('[data-view="entries"] ul');
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
}
// handle image preview input
function handleImagePreview() {
  const url = $imgUrlInput.value;
  // only update the image if the URL is valid
  if (url) {
    $imgPreview.src = url;
    $imgPreview.alt = 'Preview image';
  }
}
// event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Show the previously active view
  const previousView = data.view || 'entries';
  viewSwap(previousView);
  // toggle "no entries" message
  toggleNoEntries();
  // render existing entries on load
  const entriesList = document.querySelector('[data-view="entries"] ul');
  data.entries.forEach((entry) => {
    const entryLi = renderEntry(entry);
    entriesList.appendChild(entryLi);
  });
});
// Event listener for the "New Entry" button
const newEntryButton = document.getElementById('new-entry-btn');
newEntryButton.addEventListener('click', (event) => {
  event.preventDefault();
  viewSwap('entry-form');
});
// Event listener for the "Entries" navbar link
const entriesLink = document.querySelector('.nav-link[href="#entries"]');
entriesLink.addEventListener('click', (event) => {
  event.preventDefault();
  viewSwap('entries');
});
// Event listener for form submission
$form.addEventListener('submit', handleFormSubmit);
// Event listener for image preview input
$imgUrlInput.addEventListener('input', handleImagePreview);
