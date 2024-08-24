// Get DOM elements
const noteInput = document.getElementById('floatingTextarea2');
const noteColorSelector = document.getElementById('note-color-selector');
const addNoteBtn = document.getElementById('add-note-btn');
const noteList = document.getElementById('note-list');
const colorChangeButton = document.getElementById('color-change-button');
const addNoteButton = document.getElementById('add-note-btn');
const noteTextarea = document.getElementById('floatingTextarea2');
const deleteAllButton = document.getElementById('deleteAllButton');

// Add event listener for delete all button
deleteAllButton.addEventListener('click', deleteAllNotes);

// Load saved notes when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

    // If no saved notes, create default notes
    if (savedNotes.length === 0) {
        const defaultNotes = [
            {
                text: 'Hey, remember to buy groceries for dinner tonight. We need veggies, fruits, pasta, and some snacks. Oh, and don\'t forget the chocolate—because life is just better with chocolate, right?',
                color: '#F08080'
            },
            {
                text: 'Dude, there\'s an important meeting at 2 PM. You got this! Review the slides, gather data, and practice those power poses. By the way, did you know that pretending to be a confident peacock boosts your presentation skills?',
                color: '#98FB98'
            },
            {
                text: 'Guess what? It\'s Mom\'s birthday next weekend! Call her to wish her a happy birthday and discuss the family gathering plans. And remember, let\'s avoid bringing up the time we turned the living room into a mini waterpark. This year, let\'s stick to classic party games and, of course, cake!',
                color: '#AACCFF'
            },
            {
                text: 'Hey, did you hear about the latest superhero movie? We should totally catch it this weekend. Popcorn, comfy seats, and epic action scenes—what more could we ask for?',
                color: '#C8A2C8'
            },
            {
                text: 'I can\'t believe the weekend is almost here again. Let\'s plan a spontaneous road trip! We\'ll bring our favorite tunes, some questionable snacks, and embark on an adventure. Who cares where we end up as long as we have fun?',
                color: '#F08080'
            },
            {
                text: 'Remember that wild concert last year? Let\'s relive the memories and plan another night of live music and dancing. I\'ll grab the tickets if you promise not to sing along off-key this time!',
                color: '#98FB98'
            },
            {
                text: 'Movie marathon, anyone? Let\'s binge-watch our favorite classic films, stock up on popcorn, and get cozy. Just don\'t judge me when I cry during that emotional scene we\'ve seen a million times!',
                color: '#AACCFF'
            }
        ];
           
        // Add default notes to saved notes and create note elements
        for (const note of defaultNotes) {
            savedNotes.push(note);
            createNoteElement(note.text, note.color);
        }

        // Save default notes to local storage
        localStorage.setItem('notes', JSON.stringify(savedNotes));
    } else {
        // Create note elements for saved notes
        for (const note of savedNotes) {
            createNoteElement(note.text, note.color);
        }
    }

    // Update delete all button state
    updateDeleteAllButtonState(savedNotes.length);
});

// Disable color change and add note buttons initially
colorChangeButton.disabled = true;
addNoteButton.disabled = true;

// Handle pasting text into the textarea
noteTextarea.addEventListener("paste", (event) => {
    const pastedText = event.clipboardData.getData("text/plain");
    const paragraphs = pastedText.split("\n");
    for (const paragraph of paragraphs) {
        noteTextarea.insertAdjacentHTML("beforeend", `<p>${paragraph}</p>`);
    }
});

// Function to show toast notifications
function showToast(message) {
    const toast = new bootstrap.Toast(document.getElementById('toast'));
    const toastBody = document.querySelector('.toast-body');
    toastBody.textContent = message;
    toast.show();
}

// Add event listener for adding a note
addNoteBtn.addEventListener('click', addNote);

// Handle color selection
noteColorSelector.addEventListener('click', (event) => {
    const selectedColor = event.target.getAttribute('data-value');
    noteColorSelector.previousElementSibling.textContent = event.target.textContent;
    noteColorSelector.previousElementSibling.style.backgroundColor = selectedColor;

    colorChangeButton.style.color = '#000';
    noteColorSelector.parentNode.classList.remove('show');
});

// Enable/disable buttons based on textarea content
noteTextarea.addEventListener('input', () => {
    const noteText = noteTextarea.value.trim();

    if (noteText === '') {
        colorChangeButton.disabled = true;
        addNoteButton.disabled = true;
    } else {
        colorChangeButton.disabled = false;
        addNoteButton.disabled = false;
    }
});

// Function to show an alert with a header
function alertWithHeader(header, message) {
    alert(`${header}\n\n${message}`);
}

// Function to add a new note
function addNote() {
    const noteText = noteInput.value;
    const noteColor = noteColorSelector.previousElementSibling.style.backgroundColor;

    if (noteColor === '') {
        alert('Please select a color!');
        return;
    }

    const note = { text: noteText, color: noteColor };
    saveNoteToLocalStorage(note);
    createNoteElement(noteText, noteColor);

    noteInput.value = '';
    noteColorSelector.previousElementSibling.textContent = 'Change color';
    noteColorSelector.previousElementSibling.style.backgroundColor = '';

    colorChangeButton.disabled = true;
    addNoteButton.disabled = true;

    window.scrollTo(0, document.body.scrollHeight);

    showToast('Note added successfully');

    // Retrieve updated savedNotes from local storage
    const updatedSavedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    updateDeleteAllButtonState(updatedSavedNotes.length);
}

// Function to save a note to local storage
function saveNoteToLocalStorage(note) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.push(note);
    localStorage.setItem('notes', JSON.stringify(savedNotes));
}

// Function to create a note element in the DOM
function createNoteElement(text, color) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container', 'card', 'mb-3', 'p-3');

    const now = new Date();
    const creationDate = now.toLocaleDateString('en-GB');
    const creationTime = now.toLocaleTimeString('en-GB', { hour12: false });
    const creationDateTime = `${creationDate}, ${creationTime}`;

    const creationDateElement = document.createElement('div');
    creationDateElement.classList.add('creation-date', 'fw-lighter');
    creationDateElement.textContent = `Date: ${creationDateTime}`;
    
    const noteTextElement = document.createElement('div');
    noteTextElement.classList.add('note-text', 'mt-2', 'mb-2', 'fw-semibold');
    noteTextElement.style.textAlign = "justify";
    noteTextElement.innerHTML = text.replace(/\n/g, '<br>');
    noteTextElement.contentEditable = true;
    noteTextElement.style.backgroundColor = 'transparent';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button', 'btn', 'btn-outline-dark', 'btn-sm');
    editButton.addEventListener('click', () => {
        noteContainer.classList.add('edit-mode');
        noteTextElement.focus();
        editButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
        
        const lightColor = getLighterColor(color, 0.85);
        noteTextElement.style.backgroundColor = lightColor;
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.classList.add('save-button', 'btn', 'btn-outline-dark', 'btn-sm');
    saveButton.style.display = 'none';
    saveButton.addEventListener('click', () => {
        saveNoteChanges(noteContainer, noteTextElement);
        saveButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button', 'btn', 'btn-outline-secondary', 'btn-sm');
    deleteButton.addEventListener('click', () => {
        deleteNoteElement(noteContainer, text);
    });

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(saveButton);
    buttonsContainer.appendChild(deleteButton);

    noteContainer.style.backgroundColor = color;
    noteContainer.appendChild(creationDateElement);
    noteContainer.appendChild(noteTextElement);
    noteContainer.appendChild(buttonsContainer);
    noteList.appendChild(noteContainer);
}

// Function to get a lighter color
function getLighterColor(color, factor) {
    const hex = color.replace('#', '');
    const r = Number.parseInt(hex.substr(0, 2), 16);
    const g = Number.parseInt(hex.substr(2, 2), 16);
    const b = Number.parseInt(hex.substr(4, 2), 16);

    const lighterR = Math.round(r + (255 - r) * factor);
    const lighterG = Math.round(g + (255 - g) * factor);
    const lighterB = Math.round(b + (255 - b) * factor);

    return `rgb(${lighterR}, ${lighterG}, ${lighterB})`;
}

// Function to save changes to a note
function saveNoteChanges(noteContainer, noteTextElement) {
    const newText = noteTextElement.innerHTML.replace(/<br>/g, '\n').trim();
    const originalText = noteTextElement.getAttribute('data-original-text');

    if (newText !== originalText) {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

        const updatedNotes = savedNotes.map(note => {
            if (note.text === originalText) {
                return { text: newText, color: note.color };
            }
            return note;
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        noteTextElement.setAttribute('data-original-text', newText);
        showToast('Note changed successfully');
    }

    noteContainer.classList.remove('edit-mode');
    noteTextElement.style.backgroundColor = 'transparent';
}

// Function to delete a note
function deleteNoteElement(noteContainer, noteText) {
    const confirmed = confirm('Are you sure you want to delete this note?');

    if (confirmed) {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        const updatedNotes = savedNotes.filter(note => note.text !== noteText);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        noteContainer.remove();
        updateDeleteAllButtonState(updatedNotes.length);
        showToast('Note deleted successfully');
    }
}

// Function to delete all notes
function deleteAllNotes() {
    const confirmed = confirm('Are you sure you want to delete all notes?');

    if (confirmed) {
        localStorage.removeItem('notes');
        noteList.innerHTML = '';
        updateDeleteAllButtonState(0);
        showToast('All notes deleted successfully');
    }
}

// Function to update the state of the delete all button
function updateDeleteAllButtonState(noteCount) {
    if (noteCount >= 2) {
        deleteAllButton.disabled = false;
    } else {
        deleteAllButton.disabled = true;
    }
}