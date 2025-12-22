const admin = { username: "elazaro14", password: "503812el" };

const LS = "shule_data_v2"; // Changed key to avoid old data conflict
let data = JSON.parse(localStorage.getItem(LS)) || {
  teachers: [],
  students: [],
  marks: [],
  attendance: []
};

let currentRole = null;

// Login
function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin" && username === admin.username && password === admin.password) {
    currentRole = "admin";
    startApp();
  } else if (role === "teacher") {
    const teacher = data.teachers.find(t => t.username === username && t.password === password);
    if (teacher) {
      currentRole = "teacher";
      startApp();
    } else {
      alert("Invalid teacher credentials!");
    }
  } else {
    alert("Invalid login!");
  }
}

function startApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "flex";

  // Show/hide menu items based on role
  document.getElementById("adminMenu").style.display = currentRole === "admin" ? "block" : "none";

  // Initial render
  renderTeachers();
  renderStudents();
  populateStudents();
  updateDashboard();
  showPanel('dashboard'); // Show dashboard first
}

// Save data
function saveData() {
  localStorage.setItem(LS, JSON.stringify(data));
}

// Create Teacher
function createTeacher(e) {
  e.preventDefault();
  const name = document.getElementById("teacherName").value.trim();
  const sex = document.getElementById("teacherSex").value;
  const subjects = Array.from(document.getElementById("teacherSubjects").selectedOptions).map(o => o.value);
  const assignedClass = document.getElementById("teacherClass").value;
  const isClassTeacher = document.getElementById("roleClassTeacher").checked;
  const isSubjectTeacher = document.getElementById("roleSubjectTeacher").checked;

  if (!name || !sex || subjects.length === 0 || !assignedClass) {
    alert("Fill all required fields!");
    return;
  }

  // Generate username
  const parts = name.trim().split(" ");
  const first = parts[0].toLowerCase();
  const last = parts[parts.length - 1].toLowerCase();
  let username = `${first}.${last}`;
  let counter = 1;
  while (data.teachers.some(t => t.username === username)) {
    username = `${first}.${last}${counter++}`;
  }

  const roles = [];
  if (isClassTeacher) roles.push("Class Teacher");
  if (isSubjectTeacher) roles.push("Subject Teacher");

  data.teachers.push({
    name, sex, subjects, assignedClass, roles, username, password: "Olmotiss"
  });

  saveData();
  renderTeachers();
  updateDashboard();
  e.target.reset();
}

// Create Student
function createStudent(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const sex = document.getElementById("studentSex").value;
  const sclass = document.getElementById("studentClass").value;

  if (!name || !sex || !sclass) {
    alert("Fill all fields!");
    return;
  }

  data.students.push({ name, sex, sclass });
  saveData();
  renderStudents();
  populateStudents();
  updateDashboard();
  e.target.reset();
}

// Render Teachers Table
function renderTeachers() {
  const tbody = document.querySelector("#teacherTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.teachers.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.name}</td>
      <td>${t.sex}</td>
      <td>${t.subjects.join(", ")}</td>
      <td>${t.assignedClass}</td>
      <td>${t.roles.join(", ") || "Subject Teacher"}</td>
      <td>${t.username}</td>
      <td>${t.password}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Render Students Table
function renderStudents() {
  const tbody = document.querySelector("#studentTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.students.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.sex}</td>
      <td>${s.sclass}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Populate student dropdowns (for marks/attendance)
function populateStudents() {
  const ids = ["markStudent", "attStudent"];
  ids.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '<option value="">Select Student</option>';
    data.students.forEach(s => {
      const opt = new Option(`${s.name} (${s.sclass})`, s.name);
      select.add(opt);
    });
  });
}

// Dashboard stats
function updateDashboard() {
  document.getElementById("totalTeachers").textContent = data.teachers.length;
  document.getElementById("totalStudents").textContent = data.students.length;
  document.getElementById("totalMarks").textContent = data.marks.length;
  document.getElementById("totalAttendance").textContent = data.attendance.length;
}

// Panel switching
function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// Logout
function logout() {
  location.reload();
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}
