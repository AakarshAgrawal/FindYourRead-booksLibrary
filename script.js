/* ===========================
   Book Constructor Function
=========================== */
function Book(title, author, pages, read, genre, release, cover) {
    if (!new.target) {
        throw Error("Use 'new Book()' to create a book");
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.genre = genre;
    this.release = release;
    this.cover = cover;
    this.id = crypto.randomUUID(); // unique id for each book
}

// Toggle between "read" and "unread"
Book.prototype.toggleReadStatus = function () {
    this.read = !this.read;
};

/* ===========================
   Library Functions
=========================== */
const library = [];
const EMPTY_FIELD = "–"; // em dash for missing fields

// Add a book to the library array
function addBookToLibrary(title, author, pages, read, genre, release, cover) {
    const newBook = new Book(title, author, pages, read, genre, release, cover);
    library.push(newBook);
}

// Remove a book from the library array by id
function removeBookFromLibrary(id) {
    const index = library.findIndex((book) => book.id === id);
    if (index !== -1) {
        library.splice(index, 1);
    }
}

// Find a book in the library by id
function getBookFromId(id) {
    return library.find((book) => book.id === id) || null;
}

/* ===========================
   DOM Interaction Functions
=========================== */

// Remove book (both from array + DOM)
function handleRemoveBook(event) {
    const card = event.target.closest(".card");
    const bookTitle = card.querySelector(".title").textContent;

    if (!confirm(`Delete the book\n"${bookTitle}"?`)) return;

    const bookId = card.dataset.id;
    removeBookFromLibrary(bookId);
    card.remove();
}

// Toggle read/unread status
function handleReadBook(event) {
    const card = event.target.closest(".card");
    const bookId = card.dataset.id;
    const book = getBookFromId(bookId);

    const unreadBooksDiv = document.querySelector(".unread-books");
    const readBooksDiv = document.querySelector(".read-books");

    card.remove();

    if (book.read) {
        unreadBooksDiv.appendChild(card);
        card.querySelector("button.read").textContent = "Mark as read";
    } else {
        readBooksDiv.appendChild(card);
        card.querySelector("button.read").textContent = "Mark as unread";
    }

    book.toggleReadStatus();
}

// Display a single book card
function displayBook(book) {
    const unreadBooksDiv = document.querySelector(".unread-books");
    const readBooksDiv = document.querySelector(".read-books");
    const cardTemplate = document.querySelector(".card-template");

    const card = cardTemplate.content.cloneNode(true); // copy template
    const removeButton = card.querySelector("button.remove");
    const readButton = card.querySelector("button.read");

    // Fill in card details
    card.querySelector(".card").dataset.id = book.id;
    card.querySelector(".title").textContent = book.title;
    card.querySelector(".author span").textContent = book.author;
    card.querySelector(".pages .value").textContent = book.pages || EMPTY_FIELD;
    card.querySelector(".genre .value").textContent = book.genre || EMPTY_FIELD;
    card.querySelector(".release .value").textContent = book.release || EMPTY_FIELD;

    if (book.cover) {
        const img = card.querySelector(".picture img");
        img.src = book.cover;
        img.style.border = "2px solid rgba(201,201,201,0.5)";
        card.querySelector(".picture").style.backgroundColor = "inherit";
    }

    // Attach event listeners
    removeButton.addEventListener("click", handleRemoveBook);
    readButton.addEventListener("click", handleReadBook);

    // Place card in correct section
    if (book.read) {
        readBooksDiv.appendChild(card);
        readButton.textContent = "Mark as unread";
    } else {
        unreadBooksDiv.appendChild(card);
        readButton.textContent = "Mark as read";
    }
}

// Display all books in library
function displayAllBooks() {
    library.forEach((book) => displayBook(book));
}

/* ===========================
   Form Handling
=========================== */
function handleFormData() {
    const form = document.querySelector("#new-book-form");
    const formData = new FormData(form);

    let title = EMPTY_FIELD,
        author = EMPTY_FIELD,
        pages = EMPTY_FIELD,
        read = false,
        genre = EMPTY_FIELD,
        release = EMPTY_FIELD,
        cover = null;

    for (const [key, value] of formData) {
        switch (key) {
            case "title":
                title = value || EMPTY_FIELD;
                break;
            case "author":
                author = value || EMPTY_FIELD;
                break;
            case "pages":
                pages = value || EMPTY_FIELD;
                break;
            case "genre":
                genre = value || EMPTY_FIELD;
                break;
            case "release":
                release = value || EMPTY_FIELD;
                break;
            case "read":
                read = true;
                break;
            case "cover":
                cover = null; // decorative only
                break;
        }
    }

    form.reset();
    addBookToLibrary(title, author, pages, read, genre, release, cover);
}

/* ===========================
   Sample Books
=========================== */
function addSampleBooks() {
    addBookToLibrary("Dracula", "Bram Stoker", 461, false, "Horror", 1897, "./covers/dracula-cover.jpg");
    addBookToLibrary("Moby Dick", "Herman Melville", 635, true, "Adventure", 1851, "./covers/moby-dick-cover.jpg");
    addBookToLibrary("Sherlock Holmes", "Arthur Conan Doyle", 307, false, "Fiction", 1892, "./covers/sherlock-holmes-cover.jpg");
    addBookToLibrary("Frankenstein", "Mary Shelley", 280, false, "Horror", 1818, "./covers/frankenstein-cover.jpg");
    addBookToLibrary("Treasure Island", "Robert Louis Stevenson", 292, false, "Adventure", 1883, "./covers/treasure-island-cover.jpg");
    addBookToLibrary("The Wizard of Oz", "L. Frank Baum", 154, true, "Fantasy", 1900, "./covers/wizard-of-oz-cover.jpg");
    addBookToLibrary("The Mysterious Island", "Jules Verne", 650, false, "Adventure", 1875, "./covers/the-mysterious-island-cover.jpg");
}

/* ===========================
   Initialize App
=========================== */
function initializeLibrary() {
    const newBookButton = document.querySelector("#new-book-btn");
    const dialog = document.querySelector("#new-book-dialog");

    newBookButton.addEventListener("click", () => dialog.showModal());

    dialog.addEventListener("close", () => {
        if (dialog.returnValue === "ok-button") {
            handleFormData();
            displayBook(library[library.length - 1]); // display last added book
        }
    });

    addSampleBooks();
    displayAllBooks();
}

// Start the app
initializeLibrary();
