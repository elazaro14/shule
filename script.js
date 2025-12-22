const admin = { username: "elazaro14", password: "503812el" };
const LS_TEACHERS = "teachers";
const LS_STUDENTS = "students";
const LS_MARKS = "marks";
const LS_ATTENDANCE = "attendance";

let teachers = JSON.parse(localStorage.getItem(LS_TEACHERS)) || [];
let students = JSON.parse(localStorage.getItem(LS_STUDENTS)) || [];
let marks = JSON.parse(localStorage.getItem(LS_MARKS)) || [];
let attendance = JSON.parse(localStorage.getItem(LS_ATTENDANCE)) || [];

function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  document.getElementById("loginForm").style.display = "none";
  document.getElementById("sidebar").style.display = "block";

  if (role === "admin" && username === admin.username && password === admin.password) {
    showPanel("dashboard");
    document.getElementById("adminPanel").style.display = "block";
    populateStudents();
  } else if (role === "teacher") {
    const teacher = teachers.find(t => t.username === username && t.password === password);
    if (!teacher) return alert("Invalid teacher credentials!");
    showPanel("dashboard");
    document.getElementById("teacherPanel").style.display = "block";
    populateStudents();
  } else {
    alert("Invalid credentials!");
  }
  updateDashboard();
}

function logout() { location.reload(); }

function showPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  document.getElementById(panelId).style.display = "block";
  updateDashboard();
}

// Teacher/Student Management
function createTeacher(e) {
  e.preventDefault();
  const name = document.getElementById("teacherName").value.trim();
  const subject = document.getElementById("teacherSubject").value;
  if (!name || !subject) return;
  const username = name.toLowerCase().replace(/\s+/g, '') + "01";
  const password = "Olmotiss";
  teachers.push({ name, subject, username, password });
  localStorage.setItem(LS_TEACHERS, JSON.stringify(teachers));
  renderTeachers();
  updateDashboard();
}

function createStudent(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const sclass = document.getElementById("studentClass").value;
  if (!name || !sclass) return;
  students.push({ name, sclass });
  localStorage.setItem(LS_STUDENTS, JSON.stringify(students));
  renderStudents();
  populateStudents();
  updateDashboard();
}

function renderTeachers() {
  const tbody = document.getElementById("teacherTable").querySelector("tbody");
  tbody.innerHTML = "";
  teachers.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${t.name}</td><td>${t.subject}</td><td>${t.username}</td><td>${t.password}</td>`;
    tbody.appendChild(tr);
  });
}

function renderStudents() {
  const tbody = document.getElementById("studentTable").querySelector("tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.name}</td><td>${s.sclass}</td>`;
    tbody.appendChild(tr);
  });
}

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

// Marks
function addMarks(e) {
  e.preventDefault();
  const studentName = document.getElementById("markStudent").value;
  const score = parseInt(document.getElementById("markScore").value);
  if (!studentName || isNaN(score)) return;
  marks.push({ studentName, score });
  localStorage.setItem(LS_MARKS, JSON.stringify(marks));
  renderMarks();
  updateDashboard();
}

function renderMarks() {
  const tbody = document.getElementById("marksTable").querySelector("tbody");
  tbody.innerHTML = "";
  marks.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.studentName}</td><td>${m.score}</td>`;
    tbody.appendChild(tr);
  });
}

// Attendance
function addAttendance(e) {
  e.preventDefault();
  const studentName = document.getElementById("attStudent").value;
  const status = document.getElementById("attStatus").value;
  if (!studentName) return;
  attendance.push({ studentName, status });
  localStorage.setItem(LS_ATTENDANCE, JSON.stringify(attendance));
  renderAttendance();
  updateDashboard();
}

function renderAttendance() {
  const tbody = document.getElementById("attendanceTable").querySelector("tbody");
  tbody.innerHTML = "";
  attendance.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${a.studentName}</td><td>${a.status}</td>`;
    tbody.appendChild(tr);
  });
}

// Dashboard
function updateDashboard() {
  document.getElementById("totalTeachers").textContent = teachers.length;
  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("totalMarks").textContent = marks.length;
  document.getElementById("totalAttendance").textContent = attendance.length;
}

// Export
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

// INITIAL RENDER
renderTeachers();
renderStudents();
renderMarks();
renderAttendance();
