
function editTask(data) {
    var selectedTask = JSON.parse(data);

    document.getElementById("editName").value = selectedTask.name;
    document.getElementById("editSubject").value = selectedTask.subjectId;

    document.getElementById("updateButton").setAttribute("onclick", 'updateTask("' +selectedTask.id + '")');

    $('#editTaskModal').modal('show');
    }

function updateTask(id) {
    console.log(id);
    var response = "";

    var jsonData = new Object();
    jsonData.name = document.getElementById("editName").value;  // Corrected ID
    jsonData.subjectId = document.getElementById("editSubject").value;  // Corrected ID

    if (jsonData.name == "" || jsonData.subjectId == "") {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }
    
    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-task/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);

        console.log(response);

        if (response.message == "Task modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Task: ' + jsonData.name + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
            window.location.href = 'index.html';  // Reload or navigate after success
            
        } else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit Task!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");

// Function to add a new Task
function addTask() {
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("taskName").value;
    jsonData.subjectId = document.getElementById("taskSubject").value;

    if (jsonData.name == "" || jsonData.subjectId == "") {
        document.getElementById("taskMessage").innerHTML = 'All fields are required!';
        document.getElementById("taskMessage").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();
    request.open("POST", "/add-task", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);
        if (response.message == undefined) {
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




function deleteTask(selectedId) {
    var response = "";

    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-task/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');
    
    request.onload = function () {
    response = JSON.parse(request.responseText);
    if (response.message == "Task deleted successfully!") {
    window.location.href = 'index.html';
    }
    else {
    alert('Unable to delete task!');
    }
    };
    request.send();
    }

// Function to view all Tasks
function viewTasks() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-tasks', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = '';
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' + response[i].subjectId + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-warning" onclick="editTask(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit</button> ' +
                '<button type="button" class="btn btn-danger" onclick="deleteTask(' + response[i].id + ')">Delete</button>' +
                '</td>' +
                '</tr>';
        }
        document.getElementById('taskTableContent').innerHTML = html;
    };
    request.send();
}

