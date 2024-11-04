const { Subject } = require('../models/Subject');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function addSubject(req, res) {
    try {
        const name = req.body.name;

        const newSubject = new Subject(name);
        const updatedSubjects = await writeJSON(newSubject, 'utils/subjects.json');
        return res.status(201).json(updatedSubjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

function viewResources() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-resources', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' + response[i].location + '</td>' +
                '<td>' + response[i].description + '</td>' +
                '<td>' + response[i].owner + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-warning"
            onclick = "editResource(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') +
            '\')">Edit </button> ' +
                '<button type="button" class="btn btn-danger"
            onclick = "deleteResource(' + response[i].id + ')" > Delete</button > ' +
            '</td>' +
                '</tr>'
        }
        document.getElementById('tableContent').innerHTML = html;
    };
    request.send();
}

module.exports = {
    readJSON,
    writeJSON,
    addSubject,
    viewSubjects
};