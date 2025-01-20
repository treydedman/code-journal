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
  // create the list item and set the data-entry-id attribute
  const li = document.createElement('li');
  li.classList.add('row', 'entry');
  li.setAttribute('data-entry-id', entry.entryID.toString());
  // create the image column
  const imgColumn = document.createElement('div');
  imgColumn.classList.add('column-half');
  const img = document.createElement('img');
  img.src = entry.imgUrl || './images/placeholder-image-square.jpg';
  img.alt = entry.title;
  img.classList.add('img-placeholder');
  imgColumn.appendChild(img);
  // create the text column
  const textColumn = document.createElement('div');
  textColumn.classList.add('column-half');
  // title container with pencil icon
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('title-container');
  const title = document.createElement('h2');
  title.textContent = entry.title;
  // add the font awesome pencil icon
  const pencilIcon = document.createElement('i');
  pencilIcon.classList.add('fa-solid', 'fa-pencil', 'edit-icon');
  // append the title and pencil icon to the container
  titleContainer.appendChild(title);
  titleContainer.appendChild(pencilIcon);
  // notes
  const notes = document.createElement('p');
  notes.textContent = entry.notes;
  // append title container and notes to the text column
  textColumn.appendChild(titleContainer);
  textColumn.appendChild(notes);
  // append both image and text columns to the list item
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
  let newEntry;
  // check if editing an existing entry
  if (data.editing === null) {
    // functionality for a new entry
    newEntry = {
      entryID: data.nextEntryId,
      title: $titleInput.value,
      imgUrl: $imgUrlInput.value,
      notes: $notesInput.value,
    };
    // increment the next entry ID
    data.nextEntryId++;
    // add the new entry to the beginning of the array
    data.entries.unshift(newEntry);
  } else {
    // editing an existing entry and update the object
    newEntry = {
      entryID: data.editing.entryID,
      title: $titleInput.value,
      imgUrl: $imgUrlInput.value,
      notes: $notesInput.value,
    };
    // took me a while to get this one correct without the null error
    // check for data.editing to be non-null
    if (data.editing) {
      const index = data.entries.findIndex(
        (entry) => entry.entryID === data.editing.entryID,
      );
      if (index !== -1) {
        data.entries[index] = newEntry;
      }
      // update the DOM entry
      const entryLi = renderEntry(newEntry);
      const oldEntryLi = document.querySelector(
        `[data-entry-id="${newEntry.entryID}"]`,
      );
      if (oldEntryLi) {
        oldEntryLi.replaceWith(entryLi);
      }
      // reset data.editing to null after editing
      data.editing = null;
    }
  }
  // render the new entry or updated entry in the list
  const entriesList = document.querySelector('[data-view="entries"] ul');
  entriesList.innerHTML = '';
  data.entries.forEach((entry) => {
    const entryLi = renderEntry(entry);
    entriesList.appendChild(entryLi);
  });
  // update the "no entries" message visibility
  toggleNoEntries();
  // save the updated data to localStorage
  writeData();
  // reset the form and image preview
  $form.reset();
  $imgPreview.src = './images/placeholder-image-square.jpg';
  $imgPreview.alt = 'Preview image';
  // update the form title to "New Entry"
  const entryFormTitle = document.getElementById('new-entry-head');
  if (entryFormTitle) {
    entryFormTitle.textContent = 'New Entry';
  }
  // swap view after submitting
  viewSwap('entries');
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
  // show the previously active view
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
  // add the event listener for the pencil icon click
  entriesList.addEventListener('click', (event) => {
    // check if the clicked element is the pencil icon
    const target = event.target;
    if (target.classList.contains('edit-icon')) {
      const entryId = target.closest('li')?.getAttribute('data-entry-id');
      // find the entry by id in data.entries
      if (entryId) {
        const entry = data.entries.find(
          (entry) => entry.entryID === parseInt(entryId),
        );
        // set the data.editing property to the clicked entry
        if (entry) {
          data.editing = entry;
          // pre-populate the entry form with the values of the clicked entry
          $titleInput.value = entry.title;
          $imgUrlInput.value = entry.imgUrl;
          $notesInput.value = entry.notes;
          // pre-populate the image preview
          $imgPreview.src =
            entry.imgUrl || './images/placeholder-image-square.jpg';
          // update the title of the form to "Edit Entry"
          const entryFormTitle = document.getElementById('new-entry-head');
          if (entryFormTitle) {
            entryFormTitle.textContent = 'Edit Entry';
          }
          // switch to the entry-form view
          viewSwap('entry-form');
        }
      }
    }
  });
  // add event listener for the "New Entry" button
  const newEntryButton = document.getElementById('new-entry-btn');
  newEntryButton.addEventListener('click', (event) => {
    event.preventDefault();
    viewSwap('entry-form');
  });
  // add event listener for the "Entries" navbar link
  const entriesLink = document.querySelector('.nav-link[href="#entries"]');
  entriesLink.addEventListener('click', (event) => {
    event.preventDefault();
    viewSwap('entries');
  });
  // add event listener for form submission
  $form.addEventListener('submit', handleFormSubmit);
  // add event listener for image preview input
  $imgUrlInput.addEventListener('input', handleImagePreview);
});
