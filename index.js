const express = require('express');
const bodyParser = require('body-parser');
const { addTask, viewTasks, editTask, deleteTask } = require('./utils/TaskUtil'); // Consolidated imports
const { addSubject, viewSubjects, editSubject, deleteSubject } = require('./utils/SubjectUtils');
const { Subject } = require('./models/Subject');
const { readJSON, writeJSON } = require('./utils/SubjectUtils');
const fs = require('fs').promises;
const app = express();

const PORT = process.env.PORT || 5050;
const startPage = 'index.html';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./public'));

// Route to serve the main index page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/' + startPage);
});

// Subject Routes
app.post('/subjects', addSubject);
app.get('/subjects', viewSubjects);
app.put('/subjects/:id', editSubject);
app.delete('/subjects/:id', deleteSubject);

// Task Routes
app.post('/add-task', addTask);          // Add a new task
app.get('/view-tasks', viewTasks);        // View all tasks
app.put('/edit-task/:id', editTask);      // Edit a task
app.delete('/delete-task/:id', deleteTask); // Delete a task

// Start the server
const server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address === '::' ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project is running at: ${baseUrl}`);
});

module.exports = { app, server };
