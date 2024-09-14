const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database file.');
        }

        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to database file.');
            }
            res.status(201).json(newNote);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});