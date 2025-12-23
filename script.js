const admin = { username: "elazaro14", password: "503812el" };
const LS = "shule_data";
let data = JSON.parse(localStorage.getItem(LS)) || { teachers: [], students: [], attendance: [] };
let currentRole = null;
let currentTeacher = null;

// ===== AUTHENTICATION =====
function login(e) {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin" && user === admin.username && pass === admin.password) {
    currentRole = "admin";
    startApp();
  } else if (role === "teacher") {
    const teacher = data.teachers.find(t => t.username === user && t.password === pass);
    if (teacher) {
      currentRole = "teacher";
      currentTeacher = teacher;
      startApp();
    } else { alert("Invalid teacher credentials"); }
  } else { alert("Invalid credentials"); }
}

function startApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "flex";
  document.getElementById("adminMenu").style.display = currentRole === "admin" ? "block" : "none";
  updateDashboard();
  renderTeachers();
  renderStudents();

  if (currentRole === "teacher") {
    document.getElementById("teacherSubjectHeader").textContent = currentTeacher.subjects[0].toUpperCase();
    document.getElementById("teacherAssignedClass").textContent = currentTeacher.assignedClass;
    loadTeacherReport(currentTeacher);
    showPanel('teacherToolsPanel');
  } else { showPanel('dashboard'); }
}

// ===== PERMANENT SCORE SAVING =====
function finalizeScores() {
  const rows = document.querySelectorAll("#subjectReportTable tbody tr");
  const subject = document.getElementById("teacherSubjectHeader").textContent.toLowerCase();

  rows.forEach(row => {
    const studentName = row.cells[1].textContent.trim();
    const scores = {
      test1: row.cells[2].textContent,
      midTerm: row.cells[3].textContent,
      test2: row.cells[4].textContent,
      exam: row.cells[5].textContent,
      average: row.cells[6].textContent,
      grade: row.cells[7].textContent
    };

    const student = data.students.find(s => s.name.toUpperCase() === studentName.toUpperCase());
    if (student) {
      if (!student.performance) student.performance = {};
      student.performance[subject] = scores;
    }
  });

  saveData();
  alert("Scores saved successfully!");
}

function loadTeacherReport(teacher) {
  const subject = teacher.subjects[0].toLowerCase();
  const students = data.students.filter(s => s.sclass === teacher.assignedClass);
  const tbody = document.querySelector("#subjectReportTable tbody");
  tbody.innerHTML = "";

  students.forEach((s, i) => {
    const saved = (s.performance && s.performance[subject]) ? s.performance[subject] : {};
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name.toUpperCase()}</td>
      <td contenteditable="true" class="score-input">${saved.test1 || ""}</td>
      <td contenteditable="true" class="score-input">${saved.midTerm || ""}</td>
      <td contenteditable="true" class="score-input">${saved.test2 || ""}</td>
      <td contenteditable="true" class="score-input">${saved.exam || ""}</td>
      <td class="average">${saved.average || "0"}</td>
      <td class="grade">${saved.grade || "F"}</td>
    `;
    tbody.appendChild(tr);
    tr.querySelectorAll(".score-input").forEach(cell => {
      cell.addEventListener("input", () => calculateRowAverage(tr));
    });
  });
}

function calculateRowAverage(row) {
  const inputs = row.querySelectorAll(".score-input");
  let sum = 0, count = 0;
  inputs.forEach(input => {
    const val = parseFloat(input.textContent);
    if (!isNaN(val)) { sum += val; count++; }
  });
  const avg = count > 0 ? Math.round(sum / count) : 0;
  row.querySelector(".average").textContent = avg;
  row.querySelector(".grade").textContent = avg >= 75 ? "A" : avg >= 65 ? "B" : avg >= 45 ? "C" : avg >= 30 ? "D" : "F";
}

// ===== DATA MANAGEMENT =====
function createTeacher(e) {
  e.preventDefault();
  const name = document.getElementById("teacherName").value;
  const username = name.toLowerCase().split(" ").join(".");
  data.teachers.push({
    name, 
    sex: document.getElementById("teacherSex").value,
    subjects: Array.from(document.getElementById("teacherSubjects").selectedOptions).map(o => o.value),
    assignedClass: document.getElementById("teacherClass").value,
    roles: [document.getElementById("roleClassTeacher").checked ? "Class Teacher" : "Subject Teacher"],
    username, password: "Olmotiss"
  });
  saveData(); renderTeachers(); updateDashboard(); e.target.reset();
}

function createStudent(e) {
  e.preventDefault();
  data.students.push({
    name: document.getElementById("studentName").value,
    sex: document.getElementById("studentSex").value,
    sclass: document.getElementById("studentClass").value,
    performance: {}
  });
  saveData(); renderStudents(); updateDashboard(); e.target.reset();
}

function renderTeachers() {
  const tbody = document.querySelector("#teacherTable tbody");
  tbody.innerHTML = data.teachers.map((t, i) => `
    <tr><td>${t.name}</td><td>${t.sex}</td><td>${t.subjects.join(", ")}</td><td>${t.assignedClass}</td><td>${t.roles}</td><td>${t.username}</td><td>${t.password}</td>
    <td><button onclick="deleteItem('teachers', ${i})" class="btn-delete">Delete</button></td></tr>`).join("");
}

function renderStudents() {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = data.students.map((s, i) => `
    <tr><td>${s.name}</td><td>${s.sex}</td><td>${s.sclass}</td>
    <td><button onclick="deleteItem('students', ${i})" class="btn-delete">Delete</button></td></tr>`).join("");
}

function deleteItem(type, index) { if(confirm("Confirm delete?")) { data[type].splice(index, 1); saveData(); type === 'teachers' ? renderTeachers() : renderStudents(); updateDashboard(); } }
function showPanel(id) { document.querySelectorAll(".panel").forEach(p => p.style.display = "none"); document.getElementById(id).style.display = "block"; }
function saveData() { localStorage.setItem(LS, JSON.stringify(data)); }
function updateDashboard() { document.getElementById("totalTeachers").textContent = data.teachers.length; document.getElementById("totalStudents").textContent = data.students.length; }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function logout() { location.reload(); }
function printReport() { window.print(); }

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("teacherForm").addEventListener("submit", createTeacher);
  document.getElementById("studentForm").addEventListener("submit", createStudent);
});
