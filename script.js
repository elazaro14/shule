// Data persistence key
const LS_KEY = "olmoti_shule_data";
let db = JSON.parse(localStorage.getItem(LS_KEY)) || { teachers: [], students: [] };

const adminCreds = { user: "elazaro14", pass: "503812el" };
let activeUser = null;

// ===== LOGIN LOGIC =====
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin" && user === adminCreds.user && pass === adminCreds.pass) {
    activeUser = { role: "admin", name: "Administrator" };
    initApp();
  } else if (role === "teacher") {
    const found = db.teachers.find(t => t.username === user && t.password === pass);
    if (found) {
      activeUser = { role: "teacher", ...found };
      initApp();
    } else { alert("Invalid Teacher Credentials!"); }
  } else { alert("Login failed. Check inputs."); }
});

function initApp() {
  document.getElementById("loginScreen").classList.add("hide");
  document.getElementById("app").style.display = "flex";
  document.getElementById("adminMenu").style.display = activeUser.role === "admin" ? "block" : "none";
  
  updateDashboard();
  renderAdminTables();

  if (activeUser.role === "teacher") {
    setupTeacherView();
  } else {
    showPanel('dashboard');
  }
}

// ===== ADMIN REGISTRATION =====
document.getElementById("teacherForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("teacherName").value;
  const username = name.toLowerCase().split(" ")[0] + "." + Math.floor(100 + Math.random() * 900);
  
  db.teachers.push({
    name,
    sex: document.getElementById("teacherSex").value,
    assignedClass: document.getElementById("teacherClass").value,
    subjects: Array.from(document.getElementById("teacherSubjects").selectedOptions).map(o => o.value),
    username,
    password: "Olmotiss"
  });
  
  saveAndRefresh();
  e.target.reset();
  alert(`Teacher Added! Username: ${username}`);
});

document.getElementById("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  db.students.push({
    name: document.getElementById("studentName").value,
    sex: document.getElementById("studentSex").value,
    sclass: document.getElementById("studentClass").value,
    performance: {} // To store scores per subject
  });
  saveAndRefresh();
  e.target.reset();
});

// ===== TEACHER GRADING LOGIC =====
function setupTeacherView() {
  document.getElementById("teacherSubjectHeader").textContent = activeUser.subjects.join(", ");
  document.getElementById("teacherAssignedClass").textContent = activeUser.assignedClass;
  
  const classStudents = db.students.filter(s => s.sclass === activeUser.assignedClass);
  const tbody = document.querySelector("#subjectReportTable tbody");
  tbody.innerHTML = "";

  classStudents.forEach((s, i) => {
    const sub = activeUser.subjects[0].toLowerCase();
    const perf = (s.performance && s.performance[sub]) ? s.performance[sub] : {};
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name.toUpperCase()}</td>
      <td contenteditable="true" class="score-input">${perf.t1 || ''}</td>
      <td contenteditable="true" class="score-input">${perf.mid || ''}</td>
      <td contenteditable="true" class="score-input">${perf.t2 || ''}</td>
      <td contenteditable="true" class="score-input">${perf.exam || ''}</td>
      <td class="avg-cell">0</td>
      <td class="grade-cell">F</td>
    `;
    tbody.appendChild(tr);
    
    // Auto-calculate on entry
    tr.querySelectorAll(".score-input").forEach(cell => {
      cell.addEventListener("input", () => calculateAvg(tr));
    });
    calculateAvg(tr); // Initial load calc
  });
  
  showPanel('teacherToolsPanel');
}

function calculateAvg(row) {
  const cells = row.querySelectorAll(".score-input");
  let sum = 0, count = 0;
  cells.forEach(c => {
    const val = parseFloat(c.textContent);
    if (!isNaN(val)) { sum += val; count++; }
  });
  const avg = count > 0 ? Math.round(sum / count) : 0;
  row.querySelector(".avg-cell").textContent = avg;
  row.querySelector(".grade-cell").textContent = avg >= 75 ? "A" : avg >= 65 ? "B" : avg >= 45 ? "C" : avg >= 30 ? "D" : "F";
}

function finalizeScores() {
  const rows = document.querySelectorAll("#subjectReportTable tbody tr");
  const subject = activeUser.subjects[0].toLowerCase();

  rows.forEach(row => {
    const sName = row.cells[1].textContent;
    const student = db.students.find(s => s.name.toUpperCase() === sName);
    if (student) {
      if (!student.performance) student.performance = {};
      student.performance[subject] = {
        t1: row.cells[2].textContent,
        mid: row.cells[3].textContent,
        t2: row.cells[4].textContent,
        exam: row.cells[5].textContent
      };
    }
  });
  saveData();
  alert("Student records updated successfully!");
}

// ===== UTILITIES =====
function saveAndRefresh() {
  saveData();
  updateDashboard();
  renderAdminTables();
}

function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(db)); }

function renderAdminTables() {
  const tBody = document.querySelector("#teacherTable tbody");
  tBody.innerHTML = db.teachers.map((t, i) => `
    <tr><td>${t.name}</td><td>${t.subjects.join(", ")}</td><td>${t.assignedClass}</td><td><code>${t.username}</code></td>
    <td><button onclick="deleteItem('teachers', ${i})" class="btn-delete">Remove</button></td></tr>`).join("");

  const sBody = document.querySelector("#studentTable tbody");
  sBody.innerHTML = db.students.map((s, i) => `
    <tr><td>${s.name}</td><td>${s.sex}</td><td>${s.sclass}</td>
    <td><button onclick="deleteItem('students', ${i})" class="btn-delete">Remove</button></td></tr>`).join("");
}

function deleteItem(type, index) {
  if (confirm("Permanently delete this record?")) {
    db[type].splice(index, 1);
    saveAndRefresh();
  }
}

function updateDashboard() {
  document.getElementById("totalTeachers").textContent = db.teachers.length;
  document.getElementById("totalStudents").textContent = db.students.length;
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function logout() { location.reload(); }
function printReport() { window.print(); }
