
const { Task } = require('../models/Task');
const fs = require('fs').promises;

// Function to read JSON file
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { 
        console.error(err); 
        throw err; 
    }
}

// Function to write to JSON file
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

// Function to add a Task
async function addTask(req, res) {
    try {
        const name = req.body.name;
        const subjectId = req.body.subjectId;

        // Basic validation
        if (!name || name.length < 3) {
            return res.status(500).json({ message: 'Task name must be at least 3 characters long.' });
        }
        if (!subjectId || subjectId.length < 3) {
            return res.status(500).json({ message: 'Subject ID must be at least 3 characters long.' });
        }

        const newTask = new Task(name, subjectId);  // Create a new task instance
        const updatedTasks = await writeJSON(newTask, 'utils/tasks.json'); 
        return res.status(201).json(updatedTasks);  // Return the updated tasks
    } catch (error) {
        console.error("Error adding task:", error);
        return res.status(500).json({ message: error.message });
    }
}

// Function to view all Tasks
async function viewTasks(req, res) {
    try {
        const allTasks = await readJSON('utils/tasks.json');
        return res.status(200).json(allTasks);
    } catch (error) {
        console.error("Error viewing tasks:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addTask, viewTasks
};
