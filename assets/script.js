
   //student name validation 
   function validateName() {
    const studentName = document.getElementById("studentName").value.trim();
    const nameError = document.getElementById("nameError");

    // Regular expression for validating student name (letters only)
    const namePattern = /^[A-Za-z\s]+$/;

    if (!namePattern.test(studentName)) {
        // Show error if validation fails
        nameError.style.display = 'block';
    } else {
        // Hide error if name is valid
        nameError.style.display = 'none';
    }
}
    let editingUser = null;  // Keeps track of the user being edited

    let userForm = document.getElementById("userForm");

    userForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const studentName = document.getElementById("studentName").value.trim();
        const studentId = document.getElementById("studentId").value.trim();
        const studentEmail = document.getElementById("studentEmail").value.trim();
        const studentMobile = document.getElementById("studentMobile").value.trim();
        const studentClass = document.getElementById("studentClass").value.trim();
        const rollNo = document.getElementById("rollNo").value.trim();

        if (studentName !== '' && studentId !== '' && studentClass !== '' && rollNo !== '' && studentEmail !== ''
            && studentMobile !== ''
        ) {
            let userData = {
                studentName: studentName,
                studentId: studentId,
                studentEmail:studentEmail,
                studentMobile:studentMobile,
                studentClass: studentClass,
                rollNo: rollNo
            };
// saved data in localstorage
            let savedUserData = JSON.parse(localStorage.getItem("userData")) || [];

            // If we're editing a user
            if (editingUser) {
                // Update the user in localStorage
                savedUserData = savedUserData.map(user => 
                    user.studentId === editingUser.studentId ? userData : user
                );
                localStorage.setItem("userData", JSON.stringify(savedUserData));

                // Update the table by removing the old row and adding the new one
                 reloadTable();
                editingUser = null;  // Reset after editing
            } else {
                // Add new user
                savedUserData.push(userData);
                localStorage.setItem("userData", JSON.stringify(savedUserData));
                addUserToTable(userData);
            }

            // Reset the form after submission
            userForm.reset();
        } else {
            alert("Fields cannot be blank");
        }
    });

    // Function to add a user to the table
    function addUserToTable(user) {
        let tableBody = document.querySelector("#userTable tbody");
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.studentName}</td>
            <td>${user.studentId}</td>
            <td>${user.studentEmail}</td>
            <td>${user.studentMobile}</td>


            <td>${user.studentClass}</td>
            <td>${user.rollNo}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(this)"><i class='fa fa-trash'></i></button>
                <button class="btn btn-sm btn-primary" onclick="editUser(this)"><i class='fa fa-edit'></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    }

    // Function to update the table row when editing
    function updateTableRow(user) {
        const rows = document.querySelectorAll("#userTable tbody tr");
        rows.forEach(row => {
            const cells = row.cells;
            if (cells[1].innerText === user.studentId) {
                // Remove the old row
                row.remove();

                // Add the updated row to the table
                addUserToTable(user);
            }
        });
    }

    // Function to delete a user
    function deleteUser(button) {
        const row = button.closest("tr");
        const studentId = row.cells[1].innerText;

        let savedUserData = JSON.parse(localStorage.getItem("userData")) || [];
        savedUserData = savedUserData.filter(user => user.studentId !== studentId);
        localStorage.setItem("userData", JSON.stringify(savedUserData));

        row.remove();
    }

    // Function to fill the form with the user's current data when editing
    function editUser(button) {
        const row = button.closest("tr");
        const studentName = row.cells[0].innerText;
        const studentId = row.cells[1].innerText;
        const studentClass = row.cells[2].innerText;
        const rollNo = row.cells[3].innerText;

        // Fill the form with the current user data
        document.getElementById("studentName").value = studentName;
        document.getElementById("studentId").value = studentId;
        document.getElementById("studentClass").value = studentClass;
        document.getElementById("rollNo").value = rollNo;

        // Mark the current user as the one being edited
        editingUser = {
            studentName,
            studentId,
            studentClass,
            rollNo
        };
    }

    // Function to reload the table with updated data from localStorage
    function reloadTable() {
        let tableBody = document.querySelector("#userTable tbody");
        tableBody.innerHTML = "";  // Clear the table body
        const savedUserData = JSON.parse(localStorage.getItem("userData")) || [];
        savedUserData.forEach(user => addUserToTable(user));  // Re-add all rows
    }

    // On page load, display saved data from localStorage
    window.addEventListener("DOMContentLoaded", function() {
        reloadTable();
    });
