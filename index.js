var express = require('express');
var bodyParser = require("body-parser");
var { addTask, viewTasks } = require('./utils/TaskUtil');  // Import your utility functions
var app = express();
const PORT = process.env.PORT || 5050;
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

// Route for adding a task
app.post('/add-task', addTask);

// Route for viewing all tasks
app.get('/view-tasks', viewTasks);

// Serve the start page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address === "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };
