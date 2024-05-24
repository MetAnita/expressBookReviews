const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to get books by author
function getBooksByAuthor(authorName) {
    const authorBooks = [];
    for (const bookId in books) {
        if (books.hasOwnProperty(bookId)) {
            const book = books[bookId];
            if (book.author === authorName) {
                authorBooks.push(book);
            }
        }
    }
    return authorBooks;
}

// Function to get books by title
function getBooksByTitle(titleName) {
    const titleBooks = [];
    for (const bookId in books) {
        if (books.hasOwnProperty(bookId)) {
            const book = books[bookId];
            if (book.title === titleName) {
                titleBooks.push(book);
            }
        }
    }
    return titleBooks;
}

// Function to get book reviews by ISBN
function getBookReviews(isbn) {
    const book = books[isbn];
    if (book) {
        return book.reviews;
    } else {
        return {error: "Book not found"};
    }
}

public_users.post("/register", (req,res) => {
        const username = req.body.username;
        const password = req.body.password;
      
        if (username && password) {
          if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
          } else {
            return res.status(404).json({message: "User already exists!"});    
          }
        } 
        return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn= req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = getBooksByAuthor(author);
    res.send(JSON.stringify(booksByAuthor));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = getBooksByTitle(title);
    res.send(JSON.stringify(booksByTitle));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn= req.params.isbn;
    const bookReviews = getBookReviews(isbn);
    res.json(bookReviews);
});

module.exports.general = public_users;
