let notesContainer = document.getElementById("notes-container");
let notes = [];

class Note {
    constructor(title, content, color, isPinned = false, tags = []) {
        this.title = title;
        this.content = content;
        this.color = color;
        this.isPinned = isPinned;
        this.tags = tags;
    }
}

function pinNote(index) {
    notes[index].isPinned = !notes[index].isPinned;

    notes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
    });

    displayNotes();
    saveToLocalStorage();
}

function generateStorageNotes() {
    let storedNotes = localStorage.getItem("notes");
    notes = storedNotes ? JSON.parse(storedNotes) : [];
    displayNotes();
}

function saveValues() {
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let color = document.getElementById("color").value;
    let tags = document.getElementById("tags").value.split(',').map(tag => tag.trim());

    let note = new Note(title, content, color, false, tags);
    notes.push(note);

    console.log("Saved note:", note);
    console.log("All notes:", notes);

    displayNotes();
    saveToLocalStorage();
}


function searchNotes(query) {
    let filteredNotes = notes.filter(note => {
        query = query.toLowerCase();
        return (
            query === "" ||
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            (Array.isArray(note.tags) && note.tags.some(tag => tag.toLowerCase().includes(query))) ||
            (query !== "" && !isNaN(query) && note.title.includes(query))
        );
    });

    displayNotes(filteredNotes);
}

function displayNotes(notesToDisplay = notes) {
    notesContainer.innerHTML = "";

    notesToDisplay.forEach((note, index) => {
        generateNoteElement(note, index);
    });
}

function saveToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function generateNoteElement(note, index) {
    let noteElement = document.createElement("div");
    let titleElement = document.createElement("h4");
    let contentElement = document.createElement("p");
    let dateElement = document.createElement("p");
    let pinElement = document.createElement("input");
    let tagsElement = document.createElement("p");

    pinElement.type = "checkbox";
    pinElement.checked = note.isPinned;
    pinElement.addEventListener("change", () => pinNote(index));

    let date = new Date();
    let stringDate = date.toLocaleDateString();

    titleElement.append(note.title);
    contentElement.append(note.content);
    dateElement.append("Data stworzenia: ", stringDate);

    tagsElement.append("Tagi: ", Array.isArray(note.tags) ? note.tags.join(', ') : '');

    noteElement.append(pinElement, titleElement, contentElement, dateElement, tagsElement);
    noteElement.style.background = note.color;
    notesContainer.append(noteElement);
}

window.onload = generateStorageNotes;
