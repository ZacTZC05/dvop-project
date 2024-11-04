const fs = require('fs').promises;
const { Subject } = require('../models/Subject');

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
        const { name, location, description, owner } = req.body;

        // Basic validation
        if (!owner.includes('@') || !owner.includes('.') || description.length < 6) {
            return res.status(400).json({ message: 'Validation error' });
        }

        const newSubject = new Subject(name, location);
        const updatedSubjects = await writeJSON(newSubject, 'utils/subjects.json');
        return res.status(201).json(updatedSubjects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

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
    addSubject,
    viewSubjects
};
