// Function to edit subject data
function editSubject(data) {
    var selectedSubject = JSON.parse(data);
    document.getElementById("editSubjectName").value = selectedSubject.name;
    document.getElementById("editSubjectDescription").value = selectedSubject.description;
    document.getElementById("updateButton").setAttribute("onclick", 'updateSubject("' + selectedSubject.id + '")');
    $('#editSubjectModal').modal('show');
}

// Function to update subject data
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

// Function to delete specific subject
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

$(document).ready(function () {
    viewSubjects();
    viewTasks();
});

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
            viewSubjects();
            $('#subjectModal').modal('hide'); // Close modal after adding
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
                subjectContent += `<tr id="subjectRow-${subject.id}">
                    <td>${subject.name}</td>
                    <td>${subject.description}</td>
                    <td>${subject.id}</td>
                    <td id="actions-${subject.id}"></td>
                </tr>`;
            });
            $('#subjectTableContent').html(subjectContent);
            response.forEach(subject => {
                addActionButtons(subject.id, subject.name, subject.description);
            });
        },
        error: function (error) {
            console.error("Error fetching subjects", error);
        }
    });
}

// Function to add action buttons
function addActionButtons(id, name, description) {
    const editButton = `<button class="btn btn-warning" onclick="openEditSubjectModal('${id}', '${name}', '${description}')">Edit</button>`;
    const deleteButton = `<button class="btn btn-danger" onclick="openDeleteSubjectModal('${id}', '${name}')">Delete</button>`;
    $(`#actions-${id}`).html(editButton + deleteButton);
}


// Function to open edit modal
function openEditSubjectModal(id, name, description) {
    $('#editSubjectName').val(name);
    $('#editSubjectDescription').val(description);
    $('#editSubjectModal').data('subject-id', id).modal('show');
}

// Save edited subject
function saveEditedSubject() {
    const id = $('#editSubjectModal').data('subject-id');
    const name = $('#editSubjectName').val();
    const description = $('#editSubjectDescription').val();

    $.ajax({
        url: `/subjects/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ name, description }),
        success: function (response) {
            $('#editSubjectModal').modal('hide');
            viewSubjects();
        },
        error: function (error) {
            console.error("Error editing subject", error);
        }
    });
}

// Delete modal
function openDeleteSubjectModal(id, name) {
    $('#deleteSubjectName').text(name); // Display subject name in the modal
    $('#deleteSubjectModal').data('subject-id', id).modal('show');
}

// Confirm delete
function confirmDeleteSubject() {
    const id = $('#deleteSubjectModal').data('subject-id'); // Get subject ID from modal data attribute

    $.ajax({
        url: `/subjects/${id}`,
        method: 'DELETE',
        success: function (response) {
            $('#deleteSubjectModal').modal('hide'); // Close modal on success
            viewSubjects(); // Refresh the subjects list
        },
        error: function (error) {
            console.error("Error deleting subject", error);
        }
    });
}

