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
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
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






//   const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware to parse JSON
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Path to the db.json file
// const dbPath = path.join(__dirname, 'db.json');

// // GET route to retrieve notes
// app.get('/api/notes', (req, res) => {
//     fs.readFile(dbPath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to read notes' });
//         }
//         res.json(JSON.parse(data));
//     });
// });

// // POST route to add a new note
// app.post('/api/notes', (req, res) => {
//     const newNote = req.body;

//     fs.readFile(dbPath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to read notes' });
//         }
//         const notes = JSON.parse(data);
//         notes.push(newNote);

//         fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Failed to save note' });
//             }
//             res.status(201).json(newNote);
//         });
//     });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });