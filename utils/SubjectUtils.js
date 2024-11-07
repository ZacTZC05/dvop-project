const fs = require('fs').promises;
const { Subject } = require('../models/Subject');

// Function to read JSON File 
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to write JSON File
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

// Function to edit a subject
async function editSubject(req, res) {
    try {
        const id = req.params.id; // Get subject ID from the request parameters
        const name = req.body.name; // Get the updated name from the request body
        const description = req.body.description; // Get the updated description from the request body
        const allSubjects = await readJSON('utils/subjects.json');

        var modified = false; // Flag to check if a subject was modified

        for (var i = 0; i < allSubjects.length; i++) {
            var curentSubject = allSubjects[i];
            if (curentSubject.id == id) { // Check if the subject ID matches
                allSubjects[i].name = name;
                allSubjects[i].description = description;
                modified = true;
                break;
            }
        }
        if (modified) {
            await fs.writeFile('utils/subjects.json', JSON.stringify(allSubjects), 'utf8');
            return res.status(201).json({ message: 'Subject modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Function to delete a subject
async function deleteSubject(req, res) {
    try {
        const id = req.params.id;
        const allSubjects = await readJSON('utils/subjects.json');
        var index = -1;
        for (var i = 0; i < allSubjects.length; i++) {
            var curentSubject = allSubjects[i];
            if (curentSubject.id == id)
                index = i;
        }
        if (index != -1) {
            allSubjects.splice(index, 1);
            await fs.writeFile('utils/subjects.json', JSON.stringify(allSubjects), 'utf8');
            return res.status(201).json({ message: 'Subject deleted successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Function to add a subject
async function addSubject(req, res) {
    try {
        const { name, description } = req.body;

        // Basic validation
        if (description.length < 6) {
            return res.status(400).json({ message: 'Validation error' });
        }

        const newSubject = new Subject(name, description);
        const updatedSubjects = await writeJSON(newSubject, 'utils/subjects.json');
        return res.status(201).json(updatedSubjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Function to view all subjects
async function viewSubjects(req, res) {
    try {
        const allSubjects = await readJSON('utils/subjects.json');
        return res.status(200).json(allSubjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    editSubject,
    deleteSubject,
    addSubject,
    viewSubjects
}