let books = [];
const RENDER_EVENT = "render-book";

function addBook() {
  const inputBookTitle = document.querySelector("#inputBookTitle").value;
  const inputBookAuthor = document.querySelector("#inputBookAuthor").value;
  const inputBookYear = document.querySelector("#inputBookYear").value;
  const inputBookIsComplete = document.querySelector("#inputBookIsComplete");

  let status;
  if (inputBookIsComplete.checked) {
    status = true;
  } else {
    status = false;
  }

  books.push({
    id: +new Date(),
    title: inputBookTitle,
    author: inputBookAuthor,
    year: Number(inputBookYear),
    isCompleted: status
  });

  document.dispatchEvent(new Event(RENDER_EVENT));

  setData();
}

document.addEventListener(RENDER_EVENT, function () {

  console.log(books);

  const unCompleted = document.querySelector("#incompleteBookshelfList");
  unCompleted.innerHTML = "";

  const isCompleted = document.querySelector("#completeBookshelfList");
  isCompleted.innerHTML = "";
  for (const bookItem of books) {
    const bookElement = createBook(bookItem);
    if (!bookItem.isCompleted) {
      unCompleted.append(bookElement);
    } else {
      isCompleted.append(bookElement);
    }
  }
});

function createBook(bookItem) {
  const article = document.createElement("article");
  article.classList.add("book_item");
  const title = document.createElement("h3");
  title.classList.add("title");
  const author = document.createElement("p");
  const year = document.createElement("p");
  title.innerText = `${bookItem.title}`;
  author.innerText = `Penulis : ${bookItem.author}`;
  year.innerText = `Tahun : ${bookItem.year}`;
  const action = document.createElement("div");
  action.classList.add("action");
  article.append(title, author, year);
  if (bookItem.isCompleted) {
    const btnAddToCompleted = document.createElement("button");
    const btnDelete = document.createElement("button");
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("blue");
    btnDelete.classList.add("red");
    btnEdit.innerText = "Edit Buku";
    btnDelete.innerText = "Hapus Buku";
    btnAddToCompleted.classList.add("green");
    btnAddToCompleted.innerText = "Belum Selesai Dibaca";
    btnAddToCompleted.addEventListener("click", function () {
      undoBook(bookItem.id);
    });
    btnDelete.addEventListener("click", function () {
      deleteBook(bookItem.id);
    });
    btnEdit.addEventListener("click", function () {
      editBook(bookItem.id);
    })
    action.append(btnAddToCompleted, btnDelete, btnEdit);
    article.append(action);
  } else {
    const btnAddToCompleted = document.createElement("button");
    const btnDelete = document.createElement("button");
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("blue");
    btnEdit.innerText = "Edit Buku";
    btnDelete.classList.add("red");
    btnDelete.innerText = "Hapus Buku";
    btnAddToCompleted.classList.add("green");
    btnAddToCompleted.innerText = "Selesai Dibaca";
    btnAddToCompleted.addEventListener("click", function () {
      addToComplete(bookItem.id);
    });
    btnDelete.addEventListener("click", function () {
      deleteBook(bookItem.id);
    });
    btnEdit.addEventListener("click", function () {
      editBook(bookItem.id);
    })
    action.append(btnAddToCompleted, btnDelete, btnEdit);
    article.append(action);
  }
  return article;
}

function addToComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  setData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
}

function undoBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  setData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  setData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
    return -1
  }
}

function searchBook() {
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const moveBook = document.querySelectorAll(".title");
  for (const move of moveBook) {
    if (searchInput !== move.innerText.toLowerCase()) {
      move.parentElement.remove();
    }
  }
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  const editTitle = prompt("Enter new title:", bookTarget.title);
  const editAuthor = prompt("Enter new author:", bookTarget.author);
  const editYear = prompt("Enter new year:", bookTarget.year);

  if (editTitle === null || editAuthor === null || editYear === null) return;

  bookTarget.title = editTitle;
  bookTarget.author = editAuthor;
  bookTarget.year = editYear;

  document.dispatchEvent(new Event(RENDER_EVENT));
  setData();
}

document.addEventListener("DOMContentLoaded", function () {
  const saveForm = document.getElementById("inputBook");
  saveForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  const btnSearch = document.getElementById("searchBook");
  btnSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });
  loadData();
});

function setData() {
  localStorage.setItem("book", JSON.stringify(books));
}


function loadData() {
  const serializeData = localStorage.getItem("book");
  let data = JSON.parse(serializeData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}