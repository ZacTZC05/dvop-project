const { Task } = require('../models/Task');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
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


async function editTask(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const subjectId = req.body.subjectId;

        const allTasks = await readJSON('utils/tasks.json');

        var modified = false;

        for (let i = 0; i < allTasks.length; i++) {
            let curcurrTask = allTasks[i];
            if (curcurrTask.id == id) {
                allTasks[i].name = name;
                allTasks[i].subjectId = subjectId;

                modified = true;
            }
        }

        if (modified) {
            await fs.writeFile('utils/tasks.json', JSON.stringify(allTasks), 'utf8');
            return res.status(201).json({ message: 'Task modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


async function deleteTask(req, res) {
    try {
    const id = req.params.id;

    const allTasks = await readJSON('utils/tasks.json');
    var index = -1;

    for (var i = 0; i < allTasks.length; i++) {
    var curcurrTask = allTasks[i];
    if (curcurrTask.id == id)
    index = i;
    }

    if (index != -1) {
    allTasks.splice(index, 1);
    await fs.writeFile('utils/tasks.json', JSON.stringify(allTasks), 'utf8');
    return res.status(201).json({ message: 'Task deleted successfully!' });
    } else {
    return res.status(500).json({ message: 'Error occurred, unable to delete!' });
    }
    } catch (error) {
    return res.status(500).json({ message: error.message });
    }
    }


module.exports = {
    readJSON, writeJSON, editTask,deleteTask // Export the modified functions
};