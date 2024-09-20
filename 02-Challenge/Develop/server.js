const express = require('express');
const fs = require('fs');
const path = require('path');
// const api = require('./routes/index.js');
const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for Notes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


// Endpoint to get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }

        const notes = JSON.parse(data);
        newNote.id = notes.length + 1;
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to database file.');
            }
            res.status(201).json(newNote);
        });
    });
});

// app.delete
// Grab the note ID from the URL and do :noteID
// Grab the notes from the db.json
// Filter out by note ID, notes.flter(callback function)
// Rewrite the note.json

// DELETE Route for a specific Note
// localHost/api/notes/5
app.delete('/api/notes/:noteId', (req, res) => {
    const noteId = req.params.noteId;
    console.log('noteID', noteId);

    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        const notes = JSON.parse(data);

        // Make a new array of all notes except the one with the ID provided in the URL
        const filteredNotes = notes.filter((note) => note.id !== noteId);

        // Save that array to the filesystem
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(filteredNotes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to database file.');
            }
            res.status(201).json(noteId);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});








