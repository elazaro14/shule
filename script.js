const admin = { username: "elazaro14", password: "503812el" };
const LS = "shule_data";
let data = JSON.parse(localStorage.getItem(LS)) || { teachers: [], students: [], scores: [], attendance: [] };
let currentRole = null;
let currentTeacher = null;

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
      currentTeacher = teacher;
      startApp();
    } else {
      alert("Invalid teacher username or password");
    }
  } else {
    alert("Invalid credentials");
  }
}

function startApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "flex";
  document.getElementById("adminMenu").style.display = currentRole === "admin" ? "block" : "none";

  renderTeachers();
  renderStudents();
  updateDashboard();

  if (currentRole === "teacher") {
    const subject = currentTeacher.subjects[0] || "Unknown";
    document.getElementById("teacherSubjectHeader").textContent = subject.toUpperCase();
    document.getElementById("teacherAssignedClass").textContent = currentTeacher.assignedClass;
    loadTeacherReport(currentTeacher);
    showPanel('teacherToolsPanel');
  } else {
    showPanel('dashboard');
  }
}

function loadTeacherReport(teacher) {
  const assignedClass = teacher.assignedClass;
  const isClassTeacher = teacher.roles.includes("Class Teacher");
  document.getElementById("attendanceSection").style.display = isClassTeacher ? "block" : "none";

  const classStudents = data.students.filter(s => s.sclass === assignedClass);

  const tbody = document.querySelector("#subjectReportTable tbody");
  tbody.innerHTML = "";
  classStudents.forEach((s, i) => {
    tbody.innerHTML += `<tr>
      <td>${i + 1}</td>
      <td>${s.name.toUpperCase()}</td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td contenteditable="true"></td>
      <td></td>
      <td></td>
    </tr>`;
  });

  if (isClassTeacher) {
    const attTbody = document.querySelector("#attendanceTable tbody");
    attTbody.innerHTML = "";
    classStudents.forEach(s => {
      attTbody.innerHTML += `<tr>
        <td>${s.name}</td>
        <td>
          <select id="att-${s.name}">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Permitted">Permitted</option>
            <option value="Sick">Sick</option>
          </select>
        </td>
        <td><button onclick="saveAttendance('${s.name}')">Save</button></td>
      </tr>`;
    });
  }
}

function printReport() {
  window.print();
}

function createTeacher(e) {
  e.preventDefault();
  const name = document.getElementById("teacherName").value.trim();
  const sex = document.getElementById("teacherSex").value;
  const subjects = Array.from(document.getElementById("teacherSubjects").selectedOptions).map(o => o.value);
  const assignedClass = document.getElementById("teacherClass").value;
  const isClassTeacher = document.getElementById("roleClassTeacher").checked;
  const isSubjectTeacher = document.getElementById("roleSubjectTeacher").checked;

  if (!name || !sex || subjects.length === 0 || !assignedClass) {
    alert("Fill all required fields");
    return;
  }

  const parts = name.split(" ");
  const first = parts[0].toLowerCase();
  const last = parts[parts.length - 1].toLowerCase();
  let username = `${first}.${last}`;
  let i = 1;
  while (data.teachers.some(t => t.username === username)) {
    username = `${first}.${last}${i++}`;
  }

  const roles = [];
  if (isClassTeacher) roles.push("Class Teacher");
  if (isSubjectTeacher) roles.push("Subject Teacher");

  data.teachers.push({ name, sex, subjects, assignedClass, roles, username, password: "Olmotiss" });
  saveData();
  renderTeachers();
  updateDashboard();
  e.target.reset();
  alert(`Teacher added! Username: ${username} | Password: Olmotiss`);
}

function createStudent(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const sex = document.getElementById("studentSex").value;
  const sclass = document.getElementById("studentClass").value;

  if (!name || !sex || !sclass) {
    alert("Fill all required fields");
    return;
  }

  data.students.push({ name, sex, sclass });
  saveData();
  renderStudents();
  updateDashboard();
  e.target.reset();
  alert("Student added!");
}

function renderTeachers() {
  const tbody = document.querySelector("#teacherTable tbody");
  tbody.innerHTML = "";
  data.teachers.forEach((t, index) => {
    tbody.innerHTML += `<tr>
      <td>${t.name}</td>
      <td>${t.sex}</td>
      <td>${t.subjects.join(", ")}</td>
      <td>${t.assignedClass}</td>
      <td>${t.roles.join(", ")}</td>
      <td>${t.username}</td>
      <td>${t.password}</td>
      <td>
        <button onclick="editTeacher(${index})" class="btn-edit">Edit</button>
        <button onclick="deleteTeacher(${index})" class="btn-delete">Delete</button>
      </td>
    </tr>`;
  });
}

function renderStudents() {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";
  data.students.forEach((s, index) => {
    tbody.innerHTML += `<tr>
      <td>${s.name}</td>
      <td>${s.sex}</td>
      <td>${s.sclass}</td>
      <td>
        <button onclick="editStudent(${index})" class="btn-edit">Edit</button>
        <button onclick="deleteStudent(${index})" class="btn-delete">Delete</button>
      </td>
    </tr>`;
  });
}

function deleteTeacher(index) {
  if (confirm("Delete this teacher?")) {
    data.teachers.splice(index, 1);
    saveData();
    renderTeachers();
    updateDashboard();
  }
}

function deleteStudent(index) {
  if (confirm("Delete this student?")) {
    data.students.splice(index, 1);
    saveData();
    renderStudents();
    updateDashboard();
  }
}

function editTeacher(index) {
  const t = data.teachers[index];
  const newName = prompt("Edit Name:", t.name);
  if (newName !== null) t.name = newName;
  const newSex = prompt("Edit Sex:", t.sex);
  if (newSex !== null) t.sex = newSex;
  saveData();
  renderTeachers();
}

function editStudent(index) {
  const s = data.students[index];
  const newName = prompt("Edit Name:", s.name);
  if (newName !== null) s.name = newName;
  const newSex = prompt("Edit Sex:", s.sex);
  if (newSex !== null) s.sex = newSex;
  const newClass = prompt("Edit Class:", s.sclass);
  if (newClass !== null) s.sclass = newClass;
  saveData();
  renderStudents();
}

function saveAttendance(studentName) {
  const status = document.getElementById(`att-${studentName}`).value;
  data.attendance.push({ student: studentName, status, date: new Date().toLocaleDateString() });
  saveData();
  alert("Attendance saved!");
}

function updateDashboard() {
  document.getElementById("totalTeachers").textContent = data.teachers.length;
  document.getElementById("totalStudents").textContent = data.students.length;
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function saveData() {
  localStorage.setItem(LS, JSON.stringify(data));
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function logout() {
  location.reload();
}

// Attach form listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("teacherForm").addEventListener("submit", createTeacher);
  document.getElementById("studentForm").addEventListener("submit", createStudent);
});
