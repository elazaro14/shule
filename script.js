let students = JSON.parse(localStorage.getItem('students')) || [];

function renderTable() {
    const table = document.getElementById('studentTable');
    table.innerHTML = '<thead><tr><th>ID</th><th>Name</th><th>Grade</th><th>Actions</th></tr></thead><tbody>';
    students.forEach(student => {
        table.innerHTML += `<tr><td>${student.id}</td><td>${student.name}</td><td>${student.grade}</td><td><button onclick="editStudent(${student.id})">Edit</button> <button onclick="deleteStudent(${student.id})">Delete</button></td></tr>`;
    });
    table.innerHTML += '</tbody>';
}

function addStudent() {
    // Get form values
    const name = document.getElementById('name').value;
    const grade = document.getElementById('grade').value;
    const newStudent = { id: Date.now(), name, grade };
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
}

// Add edit/delete functions similarly
document.addEventListener('DOMContentLoaded', renderTable);
