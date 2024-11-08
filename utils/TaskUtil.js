const { Task } = require('../models/Task');
const fs = require('fs').promises;

// Function to read JSON file
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading JSON file:", err);
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
        console.error("Error writing JSON file:", err);
        throw err;
    }
}

// Function to add a Task with Subject ID validation
async function addTask(req, res) {
    try {
        const name = req.body.name;
        const subjectId = req.body.subjectId;

        // Basic validation
        if (!name || name.length < 3) {
            return res.status(400).json({ message: 'Task name must be at least 3 characters long.' });
        }
        if (!subjectId || subjectId.length < 3) {
            return res.status(400).json({ message: 'No Subject ID. Subject ID must be provided and be at least 3 characters long.' });
        }

        // Load existing subjects to validate subjectId
        const allSubjects = await readJSON('utils/subjects.json');
        const subjectExists = allSubjects.some(subject => subject.id === subjectId);

        if (!subjectExists) {
            return res.status(400).json({ message: 'Invalid Subject ID. The Subject ID does not exist.' });
        }

        // Create and save the new task
        const newTask = new Task(name, subjectId);
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

// Function to edit a Task with Subject ID validation
async function editTask(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const subjectId = req.body.subjectId;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({ message: 'No Task ID provided.' });
        }
        
        // Load existing subjects to validate subjectId
        const allSubjects = await readJSON('utils/subjects.json');
        const subjectExists = allSubjects.some(subject => subject.id === subjectId);

        if (!subjectExists) {
            return res.status(400).json({ message: 'Invalid Subject ID. Only valid Subject IDs can be assigned to a task.' });
        }

        // Load all tasks to find and update the specified task
        const allTasks = await readJSON('utils/tasks.json');
        let modified = false;

        // Find the task by ID and update the task properties
        for (let i = 0; i < allTasks.length; i++) {
            let currentTask = allTasks[i];
            if (currentTask.id === id) {
                allTasks[i].name = name;
                allTasks[i].subjectId = subjectId;
                modified = true;
                break;
            }
        }

        if (modified) {
            await fs.writeFile('utils/tasks.json', JSON.stringify(allTasks), 'utf8');
            return res.status(200).json({ message: 'Task modified successfully!' });
        } else {
            return res.status(404).json({ message: 'No Task found with the provided ID.' });
        }
    } catch (err) {
        console.error("Error editing task:", err);
        return res.status(500).json({ message: err.message });
    }
}

// Function to delete a Task
async function deleteTask(req, res) {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'No Task ID provided.' });
        }

        const allTasks = await readJSON('utils/tasks.json');
        const index = allTasks.findIndex(task => task.id === id);

        if (index !== -1) {
            allTasks.splice(index, 1);
            await fs.writeFile('utils/tasks.json', JSON.stringify(allTasks), 'utf8');
            return res.status(200).json({ message: 'Task deleted successfully!' });
        } else {
            return res.status(404).json({ message: 'No Task found with the provided ID.' });
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    addTask,
    viewTasks,
    editTask,
    deleteTask
};
