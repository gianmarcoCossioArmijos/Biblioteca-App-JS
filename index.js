
const baseUrl = "https://www.googleapis.com/books/v1/";

async function getBooksByTitle(search) {

    const response = await fetch(`${baseUrl}volumes?q=intitle${search}`);
    const data = await response.json();
    console.log(data)
    
    const booksSection = document.getElementById("books__section");
    let booksList = "";

    data.items.forEach(book => {
        
        booksList = booksList + 
                    `
                    <div class="p-3 flex flex-col rounded-lg shadow-md">

                        <div class="flex">

                            <div>
                                <img class="w-32 h-52 rounded-lg object-fill"
                                    src="${book.volumeInfo.imageLinks.smallThumbnail}"
                                    alt="${book.volumeInfo.title !== undefined ? book.volumeInfo.title : "book_image"}"
                                    >
                            </div>

                            <div class="w-60 px-2 flex flex-col gap-2 content-center justify-center">
                                <h3 class="font-bold">
                                    ${book.volumeInfo.title !== undefined ? book.volumeInfo.title : ""}
                                </h3>
                                <span style="font-size: 9px;">${book.volumeInfo.authors !== undefined ? book.volumeInfo.authors : ""}</span>
                            </div>

                        </div>

                        <div class="py-2 flex gap-1 col-span-2">
                            <button 
                            class="w-full px-4 py-2 bg-gradient-to-l from-sky-500 via-blue-500 to-blue-700 hover:bg-gradient-to-r rounded-full text-white"
                            id="book_button"
                            value="${book.id}">
                                Ver mas
                            </button>
                        </div>

                    </div>
                    `
    });

    booksSection.innerHTML = booksList;
    const book_button = document.querySelectorAll("#book_button");
    
    book_button.forEach(button  => {

        button.addEventListener("click", (event)  => {

            console.log(event.target.value);
            seeMore(event.target.value);
        })
    })
}

async function seeMore(idBook) {

    const response = await fetch(`${baseUrl}volumes/${idBook}`);
    const data = await response.json();
    console.log(data);

    const booksSection = document.getElementById("book__dialog");
    let bookCard = 
                `
                <div class="flex flex-col gap-2">

                    <div class="w-full">
                        <img
                            class="w-1/2 m-auto rounded-lg object-fill"
                            src="${data.volumeInfo.imageLinks.small !== undefined? data.volumeInfo.imageLinks.small : data.volumeInfo.imageLinks.smallThumbnail}" 
                            alt="${data.volumeInfo.title !== undefined ? data.volumeInfo.title : "book_image"}"
                            >
                    </div>

                    <div class="w-full w-1/2">
                        <h3 class="font-bold text-center">${data.volumeInfo.title !== undefined ? data.volumeInfo.title : "" }</h3>
                        <div class="rounded-lg object-fill text-center">
                            <span style="font-size: 12px;">${data.volumeInfo.publishedDate !== undefined ? data.volumeInfo.publishedDate : ""}</span>
                            <span style="font-size: 12px;"> - </span>
                            <span style="font-size: 12px;">${data.volumeInfo.authors !== undefined ? data.volumeInfo.authors : ""}</span>
                        </div>
                        <p>${data.volumeInfo.description !== undefined ? data.volumeInfo.description : ""}</p>
                    </div>

                    <button 
                        class="w-full px-4 py-2 bg-gradient-to-l from-sky-500 via-blue-500 to-blue-700 hover:bg-gradient-to-r rounded-full text-white"
                        id="readBook_button"
                        value="${data.volumeInfo.industryIdentifiers.forEach(objeto => {

                            const isbn = "ISBN:" + objeto.identifier;
                            console.log(isbn);
                            return isbn;
                        })}">
                            Leer
                    </button>
                    
                </div>
                `
    booksSection.innerHTML = bookCard;
    booksSection.showModal();

    const readButton = document.getElementById("readBook_button");
    const readBookDialog = document.getElementById("readBook__dialog");

    readButton.addEventListener("click", (event => {
        
        const isbn = event.target.value;
        console.log(isbn);
        google.books.load();

        function initialize() {
            var viewer = new google.books.DefaultViewer(document.getElementById("readBook__dialog"));
            viewer.load("ISBN:0596004478");
            nextStep(viewer);
        }
        booksSection.closest();
        google.books.setOnLoadCallback(initialize);
    }))

}

function initialize(isbn) {
    var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
    viewer.load(isbn);
}

let inputValue = "";

document.addEventListener("DOMContentLoaded", () => {

    getBooksByTitle("");

    const searchInput = document.getElementById("search__input");
    searchInput.addEventListener("keyup", (event) => {

        inputValue = event.target.value;
        getBooksByTitle(inputValue);
    })
})