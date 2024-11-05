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
        const id = req.params.id; // Get task ID from the request parameters
        const name = req.body.name; // Get the updated name from the request body
        const Subject = req.body.Subject; // Get the updated subject from the request body
        const allTasks = await readJSON('utils/tasks.json'); // Read the existing tasks
        let modified = false; // Flag to check if a task was modified

        for (let i = 0; i < allTasks.length; i++) {
            const currentTask = allTasks[i];
            if (currentTask.id === id) { // Check if the task ID matches
                allTasks[i].name = name; // Update the task name
                allTasks[i].Subject = Subject; // Update the task subject
                modified = true; // Set modified flag to true
                break; // Break out of the loop as we've found the task
            }
        }

        if (modified) {
            await fs.writeFile('utils/tasks.json', JSON.stringify(allTasks), 'utf8'); // Save changes
            return res.status(200).json({ message: 'Task modified successfully!' }); // Respond with success
        } else {
            return res.status(404).json({ message: 'Task not found!' }); // Respond with not found
        }
    } catch (error) {
        return res.status(500).json({ message: error.message }); // Handle errors
    }
}

module.exports = {
    readJSON, writeJSON, editTask  // Export the modified functions
};
