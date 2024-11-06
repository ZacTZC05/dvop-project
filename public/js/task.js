
function editTask(data) {
    var selectedTask = JSON.parse(data);

    document.getElementById("editName").value = selectedTask.name;
    document.getElementById("editSubject").value = selectedTask.subjectid;

    document.getElementById("updateButton").setAttribute("onclick", 'updateTask("' +selectedTask.id + '")');

    $('#editTaskModal').modal('show');
    }

function updateTask(id) {
    console.log(id);
    var response = "";

    var jsonData = new Object();
    jsonData.name = document.getElementById("editName").value;  // Corrected ID
    jsonData.subjectid = document.getElementById("editSubject").value;  // Corrected ID

    if (jsonData.name == "" || jsonData.subjectid == "") {
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
