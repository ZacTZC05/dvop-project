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

async function editSubject(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const allSubjects = await readJSON('utils/subjects.json');
        var modified = false;
        for (var i = 0; i < allSubjects.length; i++) {
            var curcurrSubject = allSubjects[i];
            if (curcurrSubject.id == id) {
                allSubjects[i].name = name;
                modified = true;
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

async function deleteSubject(req, res) {
    try {
        const id = req.params.id;
        const allSubjects = await readJSON('utils/subjects.json');
        var index = -1;
        for (var i = 0; i < allSubjects.length; i++) {
            var curcurrSubject = allSubjects[i];
            if (curcurrSubject.id == id)
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

module.exports = {
    readJSON,
    writeJSON,
    addSubject,
    viewSubjects,
    editSubject,
    deleteSubject
};