
const { Task } = require('../models/Task');
const fs = require('fs').promises;



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

