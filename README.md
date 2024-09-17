# Note Taker

## Description

The Note Taker is a web application that allows users to write, save, and delete notes. It is built using an Express.js back end, which saves and retrieves note data from a JSON file. The application has a user-friendly interface that lists notes and can add new notes. Deployed to Render for easy access.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Code Highlights](#code-highlights)
- [Screenshots](#screenshots)

## Installation

To install and run this application locally, please follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/johnwgomez/notetaker.git
    ```

2. Navigate to the project directory:
    ```bash
    cd notetaker
    ```

3. Install the necessary dependencies:
    ```bash
    npm install
    ```

4. Run the application:
    ```bash
    node server.js
    ```
    The server will start on `http://localhost:3001`.

## Usage

1. To use the Note Taker, open your web browser and go to `http://localhost:3001`.
2. Click the link to the "Notes" page to view existing notes and add new ones.
3. Enter a note title and text in the provided fields.
4. Click the "Save Note" button to save the new note.
5. Click on an existing note in the left-hand column to view it.
6. Use the "New Note" button to clear the fields and add a new note.
7. Click the trash can icon next to a note to delete it.

## Deployment

The application is deployed on Render and can be accessed at the following URL:
[https://notetaker-5k0m.onrender.com](https://notetaker-5k0m.onrender.com)

## Code Highlights

### Code Challenges

1. **Creating Directories and Files:**
    - I had difficulties with the `db` directory and the `db.json` file existed before the application read from or wrote to them. To solve this, I used `fs.existsSync` and `fs.mkdirSync` to create the directory and file if they were not already present.
    - Code snippet:
    ```javascript
    const dbDir = path.join(__dirname, 'db');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir);
    }
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '[]', 'utf8');
    }
    ```
    - **Resource Used:** [Stack Overflow](https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync) 

2. **Handling File Reading and Writing:**
    - I struggled with reading and writing data to `db.json`. Specifically, I learned how to use `fs.readFile` and `fs.writeFile` effectively to read, modify, and save JSON data.
    - Code snippet:
    ```javascript
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).json({ error: 'Unable to read notes' });
        }
        res.json(JSON.parse(data));
    });
    ```
    - **Resource Used:** [Node.js documentation](https://nodejs.org/api/fs.html#fsreadfilepath-options-callback) provided examples of `fs.readFile` and `fs.writeFile`.

3. **Implementing the DELETE Route:**
    - Implementing the DELETE route was challenging, especially handling the note's unique ID.
    - Code snippet:
    ```javascript
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
    ```
    - **Resource Used:** [GeeksforGeeks](https://www.geeksforgeeks.org/express-js-app-delete-function/)

## Screenshots

### 1. Application Home Page
![Application Home Page](./Screenshots/Screenshot%202024-09-16%20at%209.30.50 PM.png)

### 2. Render Dashboard
![Render Dashboard](./Screenshots/Screenshot%202024-09-16%20at%209.31.29 PM.png)

### 3. Application Note Creation
![Note Creation](./Screenshots/Screenshot%202024-09-16%20at%209.30.56 PM.png)

### 4. Note Viewing
![Note Viewing](./Screenshots/Screenshot%202024-09-16%20at%209.31.20 PM.png)