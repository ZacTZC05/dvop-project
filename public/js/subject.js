function editSubject(data) {
    var selectedSubject = JSON.parse(data);
    document.getElementById("editSubjectName").value = selectedSubject.name;
    document.getElementById("editSubjectDescription").value = selectedSubject.description;
    document.getElementById("updateButton").setAttribute("onclick", 'updateSubject("' + selectedSubject.id + '")');
    $('#editSubjectModal').modal('show');
}

function updateSubject(id) {
    console.log(id)
    var response = "";
    var jsonData = new Object();

    jsonData.name = document.getElementById("editSubjectName").value;
    jsonData.description = document.getElementById("editSubjectDescription").value;

    if (jsonData.name == "" || jsonData.description == "") {
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

// Function to add a new Subject
function addSubject() {
    const name = $('#subjectName').val();
    const description = $('#subjectDescription').val();

    $.ajax({
        url: '/subjects',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, description }),
        success: function (response) {
            $('#subjectMessage').text("Subject added successfully").css("color", "green");
            viewSubjects(); // Refresh subject list
        },
        error: function (error) {
            $('#subjectMessage').text("Error adding subject").css("color", "red");
        }
    });
}

// Function to view all Subjects
function viewSubjects() {
    $.ajax({
        url: '/subjects',
        method: 'GET',
        success: function (response) {
            let subjectContent = '';
            response.forEach(subject => {
                subjectContent += `<tr>
                    <td>${subject.name}</td>
                    <td>${subject.description}</td>
                    <td>${subject.id}</td>
                    <td class="actions-btns">
                        <button class="btn btn-warning" onclick="editSubject('${subject.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteSubject('${subject.id}')">Delete</button>
                    </td>
                </tr>`;
            });
            $('#subjectTableContent').html(subjectContent);
        },
        error: function (error) {
            console.error("Error fetching subjects", error);
        }
    });
}