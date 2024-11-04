/*

var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const { addResource } = require('./utils/TaskUtil')
app.post('/add-task', addResource);

app.get('/', (req, res) => {
res.sendFile(__dirname + "/public/" + startPage);
})
server = app.listen(PORT, function () {
const address = server.address();
const baseUrl = `http://${address.address == "::" ? 'localhost' :
address.address}:${address.port}`;
console.log(`Demo project at: ${baseUrl}`);
});
module.exports = {app, server}

*/


var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050
var startPage = "index.html";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));
 
const { addTask } = require('./utils/TaskUtil');
app.post('/add-task', addTask);
 
app.get('/', (req, res) => {
res.sendFile(__dirname + "/public/" + startPage);
})
server = app.listen(PORT, function () {
const address = server.address();
const baseUrl = `http://${address.address == "::" ? 'localhost' :
address.address}:${address.port}`;
console.log(`Demo project at: ${baseUrl}`);
});
module.exports = {app, server}