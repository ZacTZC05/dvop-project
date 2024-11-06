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
