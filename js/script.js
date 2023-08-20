const noteInput = document.getElementById('floatingTextarea2');
const noteColorSelector = document.getElementById('note-color-selector');
const addNoteBtn = document.getElementById('add-note-btn');
const noteList = document.getElementById('note-list');
const colorChangeButton = document.getElementById('color-change-button');
const addNoteButton = document.getElementById('add-note-btn');
const noteTextarea = document.getElementById('floatingTextarea2');
const deleteAllButton = document.getElementById('deleteAllButton');
deleteAllButton.addEventListener('click', deleteAllNotes);

window.addEventListener('DOMContentLoaded', () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

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
           

        defaultNotes.forEach(note => {
            savedNotes.push(note);
            createNoteElement(note.text, note.color);
        });

        localStorage.setItem('notes', JSON.stringify(savedNotes));
    } else {
        savedNotes.forEach(note => {
            createNoteElement(note.text, note.color);
        });
    }

    updateDeleteAllButtonState(savedNotes.length);
});


colorChangeButton.disabled = true;
addNoteButton.disabled = true;

noteTextarea.addEventListener("paste", function(event) {
  let pastedText = event.clipboardData.getData("text/plain");
  let paragraphs = pastedText.split("\n");
  for (let i = 0; i < paragraphs.length; i++) {
    noteTextarea.insertAdjacentHTML("beforeend", "<p>" + paragraphs[i] + "</p>");
  }
});

function showToast(message) {
    const toast = new bootstrap.Toast(document.getElementById('toast'));
    const toastBody = document.querySelector('.toast-body');
    toastBody.textContent = message;
    toast.show();
}


addNoteBtn.addEventListener('click', addNote);

noteColorSelector.addEventListener('click', (event) => {
    const selectedColor = event.target.getAttribute('data-value');
    noteColorSelector.previousElementSibling.textContent = event.target.textContent;
    noteColorSelector.previousElementSibling.style.backgroundColor = selectedColor;

    colorChangeButton.style.color = '#000';
    noteColorSelector.parentNode.classList.remove('show');
});

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

function alertWithHeader(header, message) {
    alert(`${header}\n\n${message}`);
}

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


function saveNoteToLocalStorage(note) {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.push(note);
    localStorage.setItem('notes', JSON.stringify(savedNotes));
}

function createNoteElement(text, color) {
    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note-container', 'card', 'mb-3', 'p-3');

    const now = new Date();
    const creationDate = now.toLocaleDateString('en-GB');
    const creationTime = now.toLocaleTimeString('en-GB', { hour12: false });
    const creationDateTime = `${creationDate}, ${creationTime}`;

    const creationDateElement = document.createElement('div');
    creationDateElement.classList.add('creation-date', 'fw-lighter');
    creationDateElement.textContent = 'Date: ' + creationDateTime;
    
    const noteTextElement = document.createElement('div');
    noteTextElement.classList.add('note-text', 'mt-2', 'mb-2', 'fw-semibold');
    noteTextElement.style.textAlign = "justify";
    noteTextElement.innerHTML = text.replace(/\n/g, '<br>');

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container', 'text-end');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button', 'btn', 'btn-outline-dark', 'btn-sm');
    editButton.addEventListener('click', () => {
        editNoteElement(noteTextElement, text);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button', 'btn', 'btn-outline-secondary', 'btn-sm');
    deleteButton.addEventListener('click', () => {
        deleteNoteElement(noteContainer, text);
    });

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);

    noteContainer.style.backgroundColor = color;
    noteContainer.appendChild(creationDateElement);
    noteContainer.appendChild(noteTextElement);
    noteContainer.appendChild(buttonsContainer);
    noteList.appendChild(noteContainer);
}

function deleteNoteElement(noteContainer, noteText) {
    const confirmed = confirm('Are you sure you want to delete this note?');

    if (confirmed) {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        const updatedNotes = savedNotes.filter(note => note.text !== noteText);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        noteContainer.remove();
        updateDeleteAllButtonState(updatedNotes.length);
    }

    showToast('Note deleted successfully');
}

function editNoteElement(noteTextElement, originalText) {
    const newText = prompt('Edit note text:', originalText);
    if (newText !== null) {
        const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

        const updatedNotes = savedNotes.map(note => {
            if (note.text === originalText) {
                return { text: newText, color: note.color };
            }
            return note;
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        noteTextElement.textContent = newText;
        showToast('Note changed successfully');
    }
}

function deleteAllNotes() {
    const confirmed = confirm('Are you sure you want to delete all notes?');

    if (confirmed) {
        localStorage.removeItem('notes');
        noteList.innerHTML = '';
        updateDeleteAllButtonState(0);
        showToast('All notes deleted successfully');
    }
}

function updateDeleteAllButtonState(noteCount) {
    if (noteCount >= 2) {
        deleteAllButton.disabled = false;
    } else {
        deleteAllButton.disabled = true;
    }
}