function renderTeachers() {
    const teacherList = document.getElementById('teacherList');
    teacherList.innerHTML = '<h3>Registered Teachers</h3>';
    const teachers = users.filter(u => u.role === 'teacher');
    teachers.forEach(teacher => {
        teacherList.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${teacher.firstName} ${teacher.lastName}</h5>
                        <p class="card-text">
                            Username: ${teacher.username}<br>
                            Subjects: ${teacher.subjects.join(', ')}<br>
                            Class: ${teacher.classToTeach}<br>
                            ${teacher.isClassTeacher ? `Class Teacher for: ${teacher.classTeacherFor}` : ''}
                        </p>
                        <button class="btn btn-primary btn-sm" onclick="editTeacher(${teacher.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${teacher.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderStudents() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '<h3>Registered Students</h3>';
    const students = users.filter(u => u.role === 'student');
    students.forEach(student => {
        studentList.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${student.username}</h5>
                        <p class="card-text">Class: ${student.class}</p>
                        <button class="btn btn-primary btn-sm" onclick="editStudent(${student.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${student.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// In renderDashboard
function renderDashboard() {
    if (currentUser.role === 'admin') {
        document.getElementById('adminSection').style.display = 'block';
        renderTeachers();
        renderStudents();
    }
    // ... other role views
}

// Call after registrations
// e.g., in registerTeacher: renderTeachers();
// in registerStudent: renderStudents();
