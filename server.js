//1. i need create dependencies and create unique ids
const express = require('express'); // For creating the web server
const fs = require('fs');  // For reading and writing files
const path = require('path'); // For handling file paths
const { v4: uuidv4 } = require('uuid'); // unique IDs
// initialize express appiclation and define the port
const app = express(); // Creates the Express app
const PORT = process.env.PORT || 3001; // port

// 2. Set up Middleware | Data Parse
app.use(express.json()); // Allows the app to handle JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serves files from the 'public' folder

// need a Path to db.json
const dbPath = path.join(__dirname, 'db/db.json'); //Combines the current directory name with 'db/db.json' to form the full path to the JSON file

// Ensure the db directory and db.json file exist
const dbDir = path.join(__dirname, 'db'); // Combines the current directory name with 'db' to form the full path| https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir); // If the 'db' directory does not exist, create it
}
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]', 'utf8'); // If the 'db.json' file does not exist, create an empty JSON array
}

// 3. HTML Routes
// notes return to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html')); // Sends the 'notes.html' file to the browser when '/notes' is visited
});

// 4. API Routes needed (GET, POST, DELETE requests)

// need to create a GET that reads into db.json
app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => { // Reads the 'db.json' file
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Unable to read notes' });
        }
        res.json(JSON.parse(data)); // Sends the notes as a response
    });
});

// posting in a new note
app.post('/api/notes', (req, res) => {
    console.log('Received new note:', req.body); // Add this line for debugging
    const { title, text } = req.body;
    if (!title || !text) { //checks if text is provided
        return res.status(400).json({ error: 'Title and text are needed' }); // If not, send an error
    }

    const newNote = { id: uuidv4(), title, text }; // Create a new note with a unique ID

    fs.readFile(dbPath, 'utf8', (err, data) => { //https://nodejs.org/api/fs.html#fsreadfilepath-options-callback
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Unable to read notes data' });
        }

        const notes = JSON.parse(data) || []; // Get the notes or use an empty array if the file is empty
        notes.push(newNote); // Add the new note to the list

        fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error saving note:', err);
                return res.status(500).json({ error: 'Unable to save note' });
            }
            res.json(newNote); // Send the new note as a response
        });
    });
});

// bonus!!!! https://www.geeksforgeeks.org/express-js-app-delete-function/
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(dbPath, 'utf8', (err, data) => { // Read the existing notes
        if (err) {
            console.error('Error reading notes:', err); 
            return res.status(500).json({ error: 'Unable to read notes data' });
        }

        const notes = JSON.parse(data) || []; // Get the notes or use an empty array if the file is empty
        const newNotes = notes.filter(note => note.id !== id);// Remove the note with the given ID

        fs.writeFile(dbPath, JSON.stringify(newNotes), (err) => { // Save the updated list of notes
            if (err) {
                console.error('Error deleting note:', err);
                return res.status(500).json({ error: 'Unable to delete note' });
            }
            res.json({ message: 'Note deleted successfully' }); // Send a success message
        });
    });
});

// Fallback Route to Serve index.html
// This must be the last route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html')); // Sends 'index.html' for any unknown routes
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Logs a message when the server is running
});