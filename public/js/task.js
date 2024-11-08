function editTask(data) {
    var selectedTask = JSON.parse(data);
    document.getElementById("editName").value = selectedTask.name;
    document.getElementById("editSubject").value = selectedTask.subjectId;
    document.getElementById("updateButton").setAttribute("onclick", 'updateTask("' + selectedTask.id + '")');
    $('#editTaskModal').modal('show');
}

function updateTask(id) {
    console.log(id);
    var jsonData = {
        name: document.getElementById("editName").value,
        subjectId: document.getElementById("editSubject").value
    };

    if (jsonData.name === "" || jsonData.subjectId === "") {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-task/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        try {
            var response = JSON.parse(request.responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", request.responseText);
            document.getElementById("editMessage").innerHTML = 'An error occurred while editing the task.';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
            return;
        }

        console.log(response);

        // Check if the server responded with specific error messages
        if (response.message === "No Task ID provided") {
            document.getElementById("editMessage").innerHTML = 'No Task ID provided.';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        } else if (response.message === "Invalid Subject ID. Only valid Subject IDs can be assigned to a task.") {
            document.getElementById("editMessage").innerHTML = 'Invalid Subject ID.';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        } else if (response.message === "Task modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Task: ' + jsonData.name + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
            window.location.href = 'index.html';  // Reload or navigate after success
        } else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit Task!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };

    request.onerror = function () {
        document.getElementById("editMessage").innerHTML = 'Network error occurred!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
    };

    request.send(JSON.stringify(jsonData));
}

// Function to add a new Task
function addTask() {
    var jsonData = {
        name: document.getElementById("taskName").value,
        subjectId: document.getElementById("taskSubject").value
    };

    if (jsonData.name === "" || jsonData.subjectId === "") {
        document.getElementById("taskMessage").innerHTML = 'All fields are required!';
        document.getElementById("taskMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/add-task", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        var response;
        try {
            response = JSON.parse(request.responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", request.responseText);
            document.getElementById("taskMessage").innerHTML = 'An error occurred while adding the task.';
            document.getElementById("taskMessage").setAttribute("class", "text-danger");
            return;
        }

        console.log(response);

        if (response.message === "Invalid Subject ID. The Subject ID does not exist.") {
            document.getElementById("taskMessage").innerHTML = 'Invalid Subject ID.';
            document.getElementById("taskMessage").setAttribute("class", "text-danger");
        } else if (response.message === undefined) {
            document.getElementById("taskMessage").innerHTML = 'Added Task: ' + jsonData.name + '!';
            document.getElementById("taskMessage").setAttribute("class", "text-success");
            document.getElementById("taskName").value = "";
            document.getElementById("taskSubject").value = "";
            window.location.href = 'index.html';
        } else {
            document.getElementById("taskMessage").innerHTML = 'Unable to add task!';
            document.getElementById("taskMessage").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}

// Function to delete a Task
function deleteTask(selectedId) {
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-task/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        var response;
        try {
            response = JSON.parse(request.responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", request.responseText);
            alert("An error occurred while deleting the task.");
            return;
        }

        if (response.message === "Task deleted successfully!") {
            window.location.href = 'index.html';
        } else if (response.message === "No Task found with the provided ID.") {
            alert('No Task found with the provided ID.');
        } else {
            alert('Unable to delete task!');
        }
    };

    request.send();
}

// Function to view all Tasks
function viewTasks() {
    var request = new XMLHttpRequest();
    request.open('GET', '/view-tasks', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        var response;
        try {
            response = JSON.parse(request.responseText);
        } catch (e) {
            console.error("Failed to parse JSON response:", request.responseText);
            document.getElementById('taskTableContent').innerHTML = '<tr><td colspan="3">Error loading tasks.</td></tr>';
            return;
        }

        var html = '';
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' + response[i].subjectId + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-warning" onclick="editTask(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit</button> ' +
                '<button type="button" class="btn btn-danger" onclick="deleteTask(\'' + response[i].id + '\')">Delete</button>' +
                '</td>' +
                '</tr>';
        }

        document.getElementById('taskTableContent').innerHTML = html;
    };

    request.send();
}
