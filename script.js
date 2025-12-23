const LS_KEY = "olmoti_shule_data";
let db = JSON.parse(localStorage.getItem(LS_KEY)) || { teachers: [], students: [] };
const adminCreds = { user: "elazaro14", pass: "503812el" };
let activeUser = null;
let editTeacherIndex = null;
let editStudentIndex = null;

// LOGIN
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
    if (found) { activeUser = { role: "teacher", ...found }; initApp(); }
    else { alert("Invalid Credentials"); }
  }
});

function initApp() {
  document.getElementById("loginScreen").classList.add("hide");
  document.getElementById("app").style.display = "flex";
  document.getElementById("adminMenu").style.display = activeUser.role === "admin" ? "block" : "none";
  document.getElementById("reportMenu").style.display = activeUser.role === "admin" ? "block" : "none";
  saveAndRefresh();
  showPanel(activeUser.role === "admin" ? 'dashboard' : 'teacherToolsPanel');
  if (activeUser.role === 'teacher') setupTeacherView();
}

// TEACHER ACTIONS
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
  if (editTeacherIndex !== null) { db.teachers[editTeacherIndex] = { ...db.teachers[editTeacherIndex], ...data }; editTeacherIndex = null; }
  else {
    const username = data.name.toLowerCase().split(" ")[0] + "." + Math.floor(100+Math.random()*900);
    db.teachers.push({ ...data, username, password: "Olmotiss" });
  }
  saveAndRefresh(); e.target.reset();
});

function prepareEditTeacher(index) {
  editTeacherIndex = index; const t = db.teachers[index];
  document.getElementById("teacherName").value = t.name;
  document.getElementById("teacherSubmitBtn").textContent = "Update Teacher";
}

// STUDENT ACTIONS
document.getElementById("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("studentName").value,
    sex: document.getElementById("studentSex").value,
    sclass: document.getElementById("studentClass").value
  };
  if (editStudentIndex !== null) { db.students[editStudentIndex] = { ...db.students[editStudentIndex], ...data }; editStudentIndex = null; }
  else { db.students.push({ ...data, performance: {} }); }
  saveAndRefresh(); e.target.reset();
});

function prepareEditStudent(index) {
  editStudentIndex = index; const s = db.students[index];
  document.getElementById("studentName").value = s.name;
  document.getElementById("studentSubmitBtn").textContent = "Update Student";
}

// REPORT CARD MODULE (SORTING LOGIC)
function renderAdminReportTable() {
  const cls = document.getElementById("reportClassFilter").value;
  const tbody = document.querySelector("#adminReportTable tbody");
  tbody.innerHTML = "";
  if (!cls) return;

  let filtered = db.students.filter(s => s.sclass === cls);
  
  // Female First, then Male, both Alphabetical
  filtered.sort((a, b) => {
    if (a.sex !== b.sex) return a.sex === "Female" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  tbody.innerHTML = filtered.map((s, i) => `
    <tr><td>${i+1}</td><td>${s.name.toUpperCase()}</td><td>${s.sex}</td><td>${s.sclass}</td>
    <td><button class="btn-edit" onclick="alert('Printing...')">View Card</button></td></tr>`).join("");
}

// GRADING
function calculateAvg(row) {
  const t = parseFloat(row.querySelector(".test-input").textContent) || 0;
  const e = parseFloat(row.querySelector(".exam-input").textContent) || 0;
  const total = t + e;
  let g = "F", r = "FAIL";
  if (total >= 75) { g="A"; r="EXCELLENT"; } else if (total >= 65) { g="B"; r="GOOD"; } 
  else if (total >= 45) { g="C"; r="AVERAGE"; } else if (total >= 30) { g="D"; r="SATISFACTORY"; }
  row.querySelector(".total-cell").textContent = total;
  row.querySelector(".grade-cell").textContent = g;
  row.querySelector(".comment-cell").textContent = r;
}

function setupTeacherView() {
  document.getElementById("teacherSubjectHeader").textContent = activeUser.subjects[0];
  document.getElementById("teacherAssignedClass").textContent = activeUser.assignedClass;
  const students = db.students.filter(s => s.sclass === activeUser.assignedClass);
  const tbody = document.querySelector("#subjectReportTable tbody");
  tbody.innerHTML = students.map((s, i) => `
    <tr><td>${i+1}</td><td>${s.name.toUpperCase()}</td>
    <td contenteditable="true" class="score-input test-input">0</td>
    <td contenteditable="true" class="score-input exam-input">0</td>
    <td class="total-cell">0</td><td class="avg-cell">0</td>
    <td class="grade-cell">F</td><td class="comment-cell">FAIL</td></tr>`).join("");
  tbody.querySelectorAll("tr").forEach(tr => {
    tr.querySelectorAll(".score-input").forEach(td => td.addEventListener("input", () => calculateAvg(tr)));
  });
}

function finalizeScores() { saveData(); alert("Saved!"); }
function saveAndRefresh() { saveData(); renderAdminTables(); updateDashboard(); }
function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(db)); }
function showPanel(id) { document.querySelectorAll(".panel").forEach(p => p.style.display="none"); document.getElementById(id).style.display="block"; }

function renderAdminTables() {
  const tBody = document.querySelector("#teacherTable tbody");
  tBody.innerHTML = db.teachers.map((t, i) => `<tr><td>${t.name}</td><td>${t.subjects[0]}</td><td>${t.assignedClass}</td><td>${t.isClassTeacher?'Class':''}</td><td>${t.username}</td><td><button onclick="prepareEditTeacher(${i})" class="btn-edit">Edit</button><button onclick="deleteItem('teachers', ${i})" class="btn-delete">X</button></td></tr>`).join("");
  const sBody = document.querySelector("#studentTable tbody");
  sBody.innerHTML = db.students.map((s, i) => `<tr><td>${s.name}</td><td>${s.sex}</td><td>${s.sclass}</td><td><button onclick="prepareEditStudent(${i})" class="btn-edit">Edit</button><button onclick="deleteItem('students', ${i})" class="btn-delete">X</button></td></tr>`).join("");
}
function deleteItem(type, i) { if(confirm("Delete?")) { db[type].splice(i,1); saveAndRefresh(); } }
function updateDashboard() { document.getElementById("totalTeachers").textContent = db.teachers.length; document.getElementById("totalStudents").textContent = db.students.length; }
function logout() { location.reload(); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
