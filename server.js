//1. i need create dependencies and create unique ids
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // unique IDs

const app = express();
const PORT = process.env.PORT || 3001;

// 2. Set up Middleware | Data Parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 3. HTML Routes
// notes return to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });
// get *return to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
// 4. API Routes needed (GET, POST, DELETE requests)