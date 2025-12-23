const LS_KEY = "olmoti_shule_data";
let db = JSON.parse(localStorage.getItem(LS_KEY)) || { teachers: [], students: [] };

const adminCreds = { user: "elazaro14", pass: "503812el" };
let activeUser = null;
let editTeacherIndex = null;
let editStudentIndex = null;

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
  document.getElementById("reportMenu").style.display = activeUser.role === "admin" ? "block" : "none";
  
  updateDashboard();
  renderAdminTables();

  if (activeUser.role === "teacher") {
    setupTeacherView();
  } else {
    showPanel('dashboard');
  }
}

// ===== TEACHER & STUDENT MANAGEMENT =====
document.getElementById("teacherForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("teacherName").value,
    sex: document.getElementById("teacherSex").value,
    assignedClass: document.getElementById("teacherClass").value,
    subjects: Array.from(document.getElementById("teacherSubjects").selectedOptions).map(o => o.value),
    isClassTeacher: document.getElementById("roleClassTeacher").checked,
    isSubjectTeacher: document.getElementById("roleSubjectTeacher").checked
  };

  if (editTeacherIndex !== null) {
    db.teachers[editTeacherIndex] = { ...db.teachers[editTeacherIndex], ...data };
    editTeacherIndex = null;
    document.getElementById("teacherSubmitBtn").textContent = "Register & Assign";
  } else {
    const username = data.name.toLowerCase().split(" ")[0] + "." + Math.floor(100 + Math.random() * 900);
    db.teachers.push({ ...data, username, password: "Olmotiss" });
  }
  saveAndRefresh();
  e.target.reset();
});

function prepareEditTeacher(index) {
  const t = db.teachers[index];
  editTeacherIndex = index;
  document.getElementById("teacherName").value = t.name;
  document.getElementById("teacherSex").value = t.sex;
  document.getElementById("teacherClass").value = t.assignedClass;
  const select = document.getElementById("teacherSubjects");
  Array.from(select.options).forEach(opt => opt.selected = t.subjects.includes(opt.value));
  document.getElementById("roleClassTeacher").checked = t.isClassTeacher;
  document.getElementById("roleSubjectTeacher").checked = t.isSubjectTeacher;
  document.getElementById("teacherSubmitBtn").textContent = "Update Teacher";
}

document.getElementById("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("studentName").value,
    sex: document.getElementById("studentSex").value,
    sclass: document.getElementById("studentClass").value
  };

  if (editStudentIndex !== null) {
    db.students[editStudentIndex] = { ...db.students[editStudentIndex], ...data };
    editStudentIndex = null;
    document.getElementById("studentSubmitBtn").textContent = "Enroll Student";
  } else {
    db.students.push({ ...data, performance: {} });
  }
  saveAndRefresh();
  e.target.reset();
});

function prepareEditStudent(index) {
  const s = db.students[index];
  editStudentIndex = index;
  document.getElementById("studentName").value = s.name;
  document.getElementById("studentSex").value = s.sex;
  document.getElementById("studentClass").value = s.sclass;
  document.getElementById("studentSubmitBtn").textContent = "Update Student";
}

// ===== REPORT MODULE (Female First, Alphabetical) =====
function renderAdminReportTable() {
  const cls = document.getElementById("reportClassFilter").value;
  const tbody = document.querySelector("#adminReportTable tbody");
  tbody.innerHTML = "";
  if (!cls) return;

  let filtered = db.students.filter(s => s.sclass === cls);
  
  // Sorting: Females first, then Males, both Alphabetical
  filtered.sort((a, b) => {
    if (a.sex !== b.sex) return a.sex === "Female" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  tbody.innerHTML = filtered.map((s, i) => `
    <tr><td>${i+1}</td><td>${s.name.toUpperCase()}</td><td>${s.sex}</td><td>${s.sclass}</td>
    <td><button class="btn-edit" onclick="alert('Viewing Card...')">View Card</button></td></tr>`).join("");
}

// ===== GRADING LOGIC (ENGLISH) =====
function calculateAvg(row) {
  const t = parseFloat(row.querySelector(".test-input").textContent) || 0;
  const e = parseFloat(row.querySelector(".exam-input").textContent) || 0;
  const total = t + e;
  const avg = Math.round(total / 2);
  
  let grade = "F", remark = "FAIL";
  if (total >= 75) { grade = "A"; remark = "EXCELLENT"; }
  else if (total >= 65) { grade = "B"; remark = "GOOD"; }
  else if (total >= 45) { grade = "C"; remark = "AVERAGE"; }
  else if (total >= 30) { grade = "D"; remark = "SATISFACTORY"; }

  row.querySelector(".total-cell").textContent = total;
  row.querySelector(".avg-cell").textContent = avg;
  row.querySelector(".grade-cell").textContent = grade;
  row.querySelector(".comment-cell").textContent = remark;
}

function setupTeacherView() {
  document.getElementById("teacherSubjectHeader").textContent = activeUser.subjects.join(", ");
  document.getElementById("teacherAssignedClass").textContent = activeUser.assignedClass;
  const students = db.students.filter(s => s.sclass === activeUser.assignedClass);
  const tbody = document.querySelector("#subjectReportTable tbody");
  tbody.innerHTML = "";

  students.forEach((s, i) => {
    const sub = activeUser.subjects[0].toLowerCase();
    const perf = s.performance[sub] || {};
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name.toUpperCase()}</td>
      <td contenteditable="true" class="score-input test-input">${perf.test || ''}</td>
      <td contenteditable="true" class="score-input exam-input">${perf.exam || ''}</td>
      <td class="total-cell">0</td><td class="avg-cell">0</td>
      <td class="grade-cell">F</td><td class="comment-cell">FAIL</td>`;
    tbody.appendChild(tr);
    tr.querySelectorAll(".score-input").forEach(cell => cell.addEventListener("input", () => calculateAvg(tr)));
    calculateAvg(tr);
  });
  showPanel('teacherToolsPanel');
}

function finalizeScores() {
  const rows = document.querySelectorAll("#subjectReportTable tbody tr");
  const subject = activeUser.subjects[0].toLowerCase();
  rows.forEach(row => {
    const sName = row.cells[1].textContent;
    const student = db.students.find(s => s.name.toUpperCase() === sName);
    if (student) {
      student.performance[subject] = {
        test: row.querySelector(".test-input").textContent,
        exam: row.querySelector(".exam-input").textContent
      };
    }
  });
  saveData();
  alert("Marks Saved!");
}

// ===== UTILITIES =====
function saveAndRefresh() { saveData(); renderAdminTables(); updateDashboard(); }
function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(db)); }

function renderAdminTables() {
  const tBody = document.querySelector("#teacherTable tbody");
  tBody.innerHTML = db.teachers.map((t, i) => {
    const roles = [];
    if (t.isClassTeacher) roles.push("Class");
    if (t.isSubjectTeacher) roles.push("Subject");
    return `<tr><td>${t.name}</td><td>${t.subjects.join(", ")}</td><td>${t.assignedClass}</td>
    <td><span class="role-badge">${roles.join("/")}</span></td><td><code>${t.username}</code></td>
    <td><button onclick="prepareEditTeacher(${i})" class="btn-edit"><i class="fas fa-edit"></i></button>
    <button onclick="deleteItem('teachers', ${i})" class="btn-delete"><i class="fas fa-trash"></i></button></td></tr>`;
  }).join("");

  const sBody = document.querySelector("#studentTable tbody");
  sBody.innerHTML = db.students.map((s, i) => `<tr><td>${s.name}</td><td>${s.sex}</td><td>${s.sclass}</td>
    <td><button onclick="prepareEditStudent(${i})" class="btn-edit"><i class="fas fa-edit"></i></button>
    <button onclick="deleteItem('students', ${i})" class="btn-delete"><i class="fas fa-trash"></i></button></td></tr>`).join("");
}

function deleteItem(type, index) { if (confirm("Delete this record?")) { db[type].splice(index, 1); saveAndRefresh(); } }
function updateDashboard() { 
    document.getElementById("totalTeachers").textContent = db.teachers.length;
    document.getElementById("totalStudents").textContent = db.students.length;
}
function showPanel(id) { document.querySelectorAll(".panel").forEach(p => p.style.display = "none"); document.getElementById(id).style.display = "block"; }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function logout() { location.reload(); }
function printReport() { window.print(); }
