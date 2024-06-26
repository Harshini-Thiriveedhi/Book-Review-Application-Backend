const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

// Access shared users array
let users = require('./users.js');

// Check if a user with the given username already exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Authenticate user
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password.toString());
};

// Login endpoint
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    console.log('Login Attempt:', { username, password }); // Log login attempt

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });

        req.session.authorization = { accessToken, username };
        console.log('User Authenticated:', req.session.authorization); // Log session data

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        console.log('Invalid Login:', { username, password }); // Log invalid login
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    const username = req.session.authorization.username; // Get the username from the session

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or modify the review for the book
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review; // Add or update the review
    console.log(`Review added/updated for ISBN ${isbn} by user ${username}: ${review}`);
    return res.status(200).json({ message: "Review successfully added/updated" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    const username = req.session.authorization.username; // Get the username from the session

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for the book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        console.log(`Review deleted for ISBN ${isbn} by user ${username}`);
        return res.status(200).json({ message: "Review successfully deleted" });
    } else {
        return res.status(404).json({ message: "Review not found for the user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
