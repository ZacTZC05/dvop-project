
var express = require('express');
var bodyParser = require("body-parser");
var { addTask, viewTasks } = require('./utils/TaskUtil');  // Import utility functions
var app = express();
const PORT = process.env.PORT || 5050;
var startPage = "index.html";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

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

module.exports = { app, server };
