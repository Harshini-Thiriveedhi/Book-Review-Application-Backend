const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



//get all books

public_users.get('/books', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

//async-await to get all books

public_users.get('/', async function (req, res) {
  try {
      const response = await axios.get('http://localhost:3000/books');
      const books = response.data;
      res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
      console.error('Error fetching books:', error.message);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



// Get book details based on ISBN

public_users.get('/isbn/:isbn',function (req, res) {

  const isbn=req.params.isbn;
  try{
    return res.status(200).json(books[isbn]);
  }
  catch(err)
  {
    return res.status(500).json({message: "Server error!"});
  }
});


//async-await to get book details based on isbn

 public_users.get('/book-async/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
      const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
      res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
      console.error('Error fetching book details with async-await:', error.message);
      res.status(500).json({ message: "Error fetching book details" });
  }
});
  

// Get book details based on author

public_users.get('/author/:author',function (req, res) {
  
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = [];
 bookKeys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  });

 if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: 'No books found for the given author.' });
  }
});

//async -await to get all books by author

public_users.get('/async-author/:author', async function (req, res) {
  const { author } = req.params;
  try {
      const response = await axios.get(`http://localhost:3000/author/${author}`); // Make sure to change port if needed
      res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
      console.error('Error fetching book details by author with async-await:', error.message);
      res.status(500).json({ message: "Error fetching book details by author" });
  }
});

// Get all books based on title

public_users.get('/title/:title',function (req, res) {
  
  const title= req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];

  bookKeys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: 'No books found for the given author.' });
  }
});

//async-await to get all books based on title

public_users.get('/async-title/:title', async function (req, res) {
  const { title } = req.params;
  try {
      const response = await axios.get(`http://localhost:3000/title/${title}`); // Make sure to change port if needed
      res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
      console.error('Error fetching book details by title with async-await:', error.message);
      res.status(500).json({ message: "Error fetching book details by title" });
  }
});

//Get book review based on isbn

public_users.get('/review/:isbn',function (req, res) {
 
  const isbn=req.params.isbn;
  const book=books[isbn];
  if(book){
    return res.status(200).json(book.reviews)
  }
  else{
  return res.status(500).json({message: "Yet to be implemented"});
  }
});

module.exports.general = public_users;
