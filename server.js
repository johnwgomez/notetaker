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

// need a Path to db.json
const dbPath = path.join(__dirname, 'develop/db/db.json');

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

// need to create a GET that reads into db.json
app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Unable to read notes' });
        }
        res.json(JSON.parse(data));
    });
});

// posting in a new note
app.post('/api/notes', (req, res) => {
    console.log('Received new note:', req.body); // Add this line for debugging
    const { title, text } = req.body;
    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are needed' });
    }

    const newNote = { id: uuidv4(), title, text };

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Unable to read notes data' });
        }

        const notes = JSON.parse(data) || [];
        notes.push(newNote);

        fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error saving note:', err);
                return res.status(500).json({ error: 'Unable to save note' });
            }
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Unable to read notes data' });
        }

        const notes = JSON.parse(data) || [];
        const newNotes = notes.filter(note => note.id !== id);

        fs.writeFile(dbPath, JSON.stringify(newNotes), (err) => {
            if (err) {
                console.error('Error deleting note:', err);
                return res.status(500).json({ error: 'Unable to delete note' });
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});

// Fallback Route to Serve index.html
// This must be the last route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});