$(document).ready(function() {
    viewSubjects();
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

