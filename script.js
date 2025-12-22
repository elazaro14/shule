// Predefined admin
const admin = { username: "elazaro14", password: "503812el" };

// LocalStorage keys
const LS_TEACHERS = "teachers";
const LS_STUDENTS = "students";
const LS_MARKS = "marks";
const LS_ATTENDANCE = "attendance";

// Load data
let teachers = JSON.parse(localStorage.getItem(LS_TEACHERS)) || [];
let students = JSON.parse(localStorage.getItem(LS_STUDENTS)) || [];
let marks = JSON.parse(localStorage.getItem(LS_MARKS)) || [];
let attendance = JSON.parse(localStorage.getItem(LS_ATTENDANCE)) || [];

// LOGIN
function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin" && username === admin.username && password === admin.password) {
    showPanel("home");
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("navBar").style.display = "block";
  } else if (role === "teacher") {
    const teacher = teachers.find(t => t.username === username && t.password === password);
    if (teacher) {
      showPanel("home");
      document.getElementById("teacherPanel").style.display = "block";
      document.getElementById("navBar").style.display = "block";
      populateStudents();
    } else {
      alert("Invalid teacher credentials!");
    }
  } else {
    alert("Invalid credentials!");
  }

  document.getElementById("loginForm").style.display = "none";
}

// LOGOUT
function logout() {
  location.reload();
}

// SWITCH PANEL
function showPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  document.getElementById(panelId).style.display = "block";
}

// TEACHER AUTO USERNAME
function autoUsername() {
  const name = document.getElementById("teacherName").value.trim();
  if (name) {
    document.getElementById("teacherName").value = name;
  } else {
    alert("Enter teacher name first!");
  }
}

// CREATE TEACHER
function createTeacher(e) {
  e.preventDefault();
  const name = document.getElementById("teacherName").value.trim();
  const subject = document.getElementById("teacherSubject").value;
  if (!name || !subject) return;

  const username = name.toLowerCase().replace(/\s+/g, '') + "01";
  const password = "Olmotiss";

  const teacher = { name, subject, username, password };
  teachers.push(teacher);
  localStorage.setItem(LS_TEACHERS, JSON.stringify(teachers));
  renderTeachers();
}

// RENDER TEACHERS
function renderTeachers() {
  const list = document.getElementById("teacherList");
  list.innerHTML = "";
  teachers.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.name} (${t.subject}) - Username: ${t.username}, Password: ${t.password}`;
    list.appendChild(li);
  });
}
renderTeachers();

// CREATE STUDENT
function createStudent(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const sclass = document.getElementById("studentClass").value;
  if (!name || !sclass) return;

  const student = { name, sclass };
  students.push(student);
  localStorage.setItem(LS_STUDENTS, JSON.stringify(students));
  renderStudents();
  populateStudents();
}

// RENDER STUDENTS
function renderStudents() {
  const list = document.getElementById("studentList");
  list.innerHTML = "";
  students.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.name} (${s.sclass})`;
    list.appendChild(li);
  });
}
renderStudents();

// POPULATE STUDENT DROPDOWNS
function populateStudents() {
  const markSelect = document.getElementById("markStudent");
  const attSelect = document.getElementById("attStudent");
  markSelect.innerHTML = '<option value="">Select Student</option>';
  attSelect.innerHTML = '<option value="">Select Student</option>';
  students.forEach(s => {
    const option = document.createElement("option");
    option.value = s.name;
    option.textContent = `${s.name} (${s.sclass})`;
    markSelect.appendChild(option.cloneNode(true));
    attSelect.appendChild(option.cloneNode(true));
  });
}

// ADD MARKS
function addMarks(e) {
  e.preventDefault();
  const studentName = document.getElementById("markStudent").value;
  const score = parseInt(document.getElementById("markScore").value);
  if (!studentName || isNaN(score)) return;

  marks.push({ studentName, score });
  localStorage.setItem(LS_MARKS, JSON.stringify(marks));
  renderMarks();
}

// RENDER MARKS
function renderMarks() {
  const list = document.getElementById("marksList");
  list.innerHTML = "";
  marks.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.studentName} - Score: ${m.score}`;
    list.appendChild(li);
  });
}
renderMarks();

// ADD ATTENDANCE
function addAttendance(e) {
  e.preventDefault();
  const studentName = document.getElementById("attStudent").value;
  const status = document.getElementById("attStatus").value;
  if (!studentName) return;

  attendance.push({ studentName, status });
  localStorage.setItem(LS_ATTENDANCE, JSON.stringify(attendance));
  renderAttendance();
}

// RENDER ATTENDANCE
function renderAttendance() {
  const list = document.getElementById("attendanceList");
  list.innerHTML = "";
  attendance.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.studentName} - ${a.status}`;
    list.appendChild(li);
  });
}
renderAttendance();

// EXPORT FUNCTIONS
function exportExcel() {
  let csv = "Student,Score,Attendance\n";
  students.forEach(s => {
    const mark = marks.find(m => m.studentName === s.name)?.score || "";
    const att = attendance.find(a => a.studentName === s.name)?.status || "";
    csv += `${s.name},${mark},${att}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "report.csv";
  link.click();
}

function exportPDF() {
  let content = "Student Report\n\n";
  students.forEach(s => {
    const mark = marks.find(m => m.studentName === s.name)?.score || "";
    const att = attendance.find(a => a.studentName === s.name)?.status || "";
    content += `${s.name} - Score: ${mark}, Attendance: ${att}\n`;
  });
  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "report.pdf";
  link.click();
}

