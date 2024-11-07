var express = require('express');
var bodyParser = require("body-parser");
var { addTask, viewTasks } = require('./utils/TaskUtil');  // Import utility functions
var app = express();

const PORT = process.env.PORT || 5050
var startPage = "index.html";

// Import utility functions (duplicate import issue here)
var { addTask, viewTasks, editTask, deleteTask } = require('./utils/TaskUtil');

const PORT = process.env.PORT || 5050;
var startPage = "index.html";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

// Routes for task-related operations
const { addSubject, viewSubjects, editSubject, deleteSubject } = require('./utils/SubjectUtils');
app.post('/subjects', addSubject);
app.get('/subjects', viewSubjects);
app.put('/subjects/:id', editSubject);
app.delete('/subjects/:id', deleteSubject);

// Endpoint to add a new Subject
app.post('/subjects', async (req, res) => {
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
app.get('/subjects', async (req, res) => {
    try {
        const subjects = await readJSON('utils/subjects.json');
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to edit a Subject
app.put('/subjects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;
        const updatedSubjects = await editSubject(id, name, description);
        res.status(200).json(updatedSubjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to delete a Subject
app.delete('/subjects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const response = await deleteSubject(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to serve the index page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})

var server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});
module.exports = { app, server }
=======

const { editTask , deleteTask, } = require('./utils/TaskUtil')
app.put('/edit-task/:id', editTask);
app.delete('/delete-task/:id', deleteTask);


// Route for adding a task
app.post('/add-task', addTask);  // Route to handle adding a new task

// Route for viewing all tasks
app.get('/view-tasks', viewTasks);  // Route to handle viewing all tasks

// Serve the main start page

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});

// Start the server
var server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address === "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project is running at: ${baseUrl}`);
});

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
app.post('/subjects', async (req, res) => {
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
app.get('/subjects', async (req, res) => {
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