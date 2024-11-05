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
 
async function addTask(req, res) {
    try {
        const name = req.body.name;
        const Subject = req.body.Subject;  // Change from location to subject
 
        // Simple validation for task name and subject
        if (!name || name.length < 3) {
            return res.status(400).json({ message: 'Task name must be at least 3 characters long.' });
        }
        if (!Subject || Subject.length < 3) {
            return res.status(400).json({ message: 'Subject must be at least 3 characters long.' });
        }
 
        const newTask = new Task(name, Subject);  // Create a new task instance
        const updatedTasks = await writeJSON(newTask, 'utils/tasks.json');  // Update to tasks.json
        return res.status(201).json(updatedTasks);  // Return the updated tasks
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


async function viewTasks(req, res) {
    try {
    const allTasks = await readJSON('utils/tasks.json');
    return res.status(201).json(allTasks);
    } catch (error) {
    return res.status(500).json({ message: error.message });
    }
    }
 
module.exports = {
    readJSON, writeJSON, addTask, viewTasks  // Export the modified functions
};