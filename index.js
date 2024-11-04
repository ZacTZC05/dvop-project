const fs = require('fs').promises;
const { Subject, Task } = require('./models/Subject');
const { readJSON, writeJSON } = require('./utils/SubjectUtils');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5050;
let startPage = 'index.html';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));

// Route to serve index page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/' + startPage);
});

// Endpoint to add a new Subject
app.post('/api/subjects', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newSubject = new Subject(name, description);
        const subjects = await writeJSON(newSubject, 'utils/subjects.json');
        res.status(201).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to view all Subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const subjects = await readJSON('utils/subjects.json');
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == '::' ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };
