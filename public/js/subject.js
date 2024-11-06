function addSubject() {
    var response = "";

    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;

    if (jsonData.name == "") {
        document.getElementById("message").innerHTML = 'All fields are required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "/add-subject", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response)
        if (response.message == undefined) {
            document.getElementById("message").innerHTML = 'Added Subject: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");
            document.getElementById("name").value = "";
            window.location.href = 'index.html';
        }
        else {
            document.getElementById("message").innerHTML = 'Unable to add subject!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}

function viewSubjects() {
    var response = '';
    var request = new XMLHttpRequest();
    request.open('GET', '/view-subjects', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        var html = ''
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' + '<button type="button" class="btn btn-warning" onclick = "editSubject(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' + '<button type="button" class="btn btn-danger" onclick = "deleteSubject(' + response[i].id + ')" > Delete</button > ' + '</td>' + '</tr>';
        }
        document.getElementById('tableContent').innerHTML = html;
    };
    request.send();
}

function editSubject(data) {
    var selectedSubject = JSON.parse(data);
    document.getElementById("editName").value = selectedSubject.name;
    document.getElementById("updateButton").setAttribute("onclick", 'updateSubject("' + selectedSubject.id + '")');
    $('#editSubjectModal').modal('show');
}

function updateSubject(id) {
    console.log(id)
    var response = "";
    var jsonData = new Object();
    jsonData.name = document.getElementById("editName").value;
    if (jsonData.name == "") {
        document.getElementById("editMessage").innerHTML = 'All fields are required!';
        document.getElementById("editMessage").setAttribute("class", "text-danger");
        return;
    }
    var request = new XMLHttpRequest();
    request.open("PUT", "/edit-subject/" + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Subject modified successfully!") {
            document.getElementById("editMessage").innerHTML = 'Edited Subject: ' + jsonData.name + '!';
            document.getElementById("editMessage").setAttribute("class", "text-success");
            window.location.href = 'index.html';
        }
        else {
            document.getElementById("editMessage").innerHTML = 'Unable to edit subject!';
            document.getElementById("editMessage").setAttribute("class", "text-danger");
        }
    };
    request.send(JSON.stringify(jsonData));
}

function deleteSubject(selectedId) {
    var response = "";
    var request = new XMLHttpRequest();
    request.open("DELETE", "/delete-subject/" + selectedId, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function () {
        response = JSON.parse(request.responseText);
        if (response.message == "Subject deleted successfully!") {
            window.location.href = 'index.html';
        }
        else {
            alert('Unable to delete subject!');
        }
    };
    request.send();
}