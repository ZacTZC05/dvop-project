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

