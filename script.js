let teachers = [];
let students = [];

const teacherForm = document.getElementById("teacherForm");
const teacherTable = document.getElementById("teacherTable");
const teacherCount = document.getElementById("teacherCount");

const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const studentCount = document.getElementById("studentCount");

// ADD TEACHER
teacherForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("teacherName").value;
  const subject = document.getElementById("teacherSubject").value;

  teachers.push({ name, subject });
  teacherForm.reset();
  renderTeachers();
});

// ADD STUDENT
studentForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("studentName").value;
  const cls = document.getElementById("studentClass").value;

  students.push({ name, cls });
  studentForm.reset();
  renderStudents();
});

function renderTeachers() {
  teacherTable.innerHTML = "";
  teachers.forEach((t, i) => {
    teacherTable.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${t.name}</td>
        <td>${t.subject}</td>
      </tr>
    `;
  });
  teacherCount.innerText = teachers.length;
}

function renderStudents() {
  studentTable.innerHTML = "";
  students.forEach((s, i) => {
    studentTable.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>${s.cls}</td>
      </tr>
    `;
  });
  studentCount.innerText = students.length;
}
