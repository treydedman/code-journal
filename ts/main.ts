// interface for entry
interface Entry {
  entryID: number;
  title: string;
  imgUrl: string;
  notes: string;
}

// query for DOM elements
const $form = document.querySelector('form') as HTMLFormElement;
const $imgPreview = document.querySelector(
  '.img-placeholder',
) as HTMLImageElement;
const $imgUrlInput = document.getElementById('url') as HTMLInputElement;
const $titleInput = document.getElementById('title') as HTMLInputElement;
const $notesInput = document.getElementById('notes') as HTMLInputElement;

// check for query errors
if (!$form) throw new Error('$form query failed');
if (!$imgPreview) throw new Error('$imgPreview query failed');
if (!$imgUrlInput) throw new Error('$imgUrlInput query failed');
if (!$titleInput) throw new Error('$titleInput query failed');
if (!$notesInput) throw new Error('$notesInput query failed');

// add event listener for img url input
$imgUrlInput.addEventListener('input', () => {
  const $newImgUrl = $imgUrlInput.value;

  // set the src attribute
  $imgPreview.src = $newImgUrl || './images/placeholder-image-square.jpg';
  $imgPreview.alt =
    'updated preview image' || 'default placeholder image for journal entry';
});

// add form event listener for entry submit
$form.addEventListener('submit', (event) => {
  // prevent page from refreshing
  event.preventDefault();

  // new entry object from the form and assign entryID
  const newEntry: Entry = {
    entryID: data.nextEntryId,
    title: $titleInput.value,
    imgUrl: $imgUrlInput.value,
    notes: $notesInput.value,
  };

  // increment the nextEntryID
  data.nextEntryId++;

  // add new entry to beginning of array of entries
  data.entries.unshift(newEntry);

  // save updated data to localStorage
  writeData();

  // clear and reset form fields
  $imgPreview.src = './images/placeholder-image-square.jpg';
  $imgPreview.alt = 'default placeholder image for journal entry';
  $form.reset();
});
