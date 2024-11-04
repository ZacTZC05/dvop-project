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

async function viewSubjects(req, res) {
    try {
        const allSubjects = await readJSON('utils/subjects.json');
        return res.status(201).json(allSubjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    addSubject,
    viewSubjects
};