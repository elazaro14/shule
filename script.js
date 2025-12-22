const admin = { username: "elazaro14", password: "503812el" };
const LS = "shule_data";
let data = JSON.parse(localStorage.getItem(LS)) || { teachers: [], students: [], marks: [], attendance: [] };
let currentRole = null;

function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin" && username === admin.username && password === admin.password) {
    currentRole = "admin";
    initApp();
  } else if (role === "teacher") {
    const teacher = data.teachers.find(t => t.username === username && t.password === password);
    if (teacher) {
      currentRole = "teacher";
      initApp();
    } else alert("Invalid teacher login!");
  } else alert("Invalid credentials!");
}

function initApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "flex";
  document.getElementById("adminMenu").style.display = currentRole === "admin" ? "block" : "none";
  document.getElementById("teacherMenu").style.display = currentRole === "teacher" ? "block" : "none";
  renderAll();
  populateStudents();
}

function createTeacher(e) {
  e.preventDefault();
  const first = document.getElementById("teacherFirst").value.trim();
  const last = document.getElementById("teacherLast").value.trim();
  const subjects = Array.from(document.getElementById("teacherSubjects").selectedOptions).map(o => o.value);
  const password = document.getElementById("teacherPass").value || "Olmotiss";

  const username = (first + "." + last).toLowerCase();

  data.teachers.push({ name: first + " " + last, subjects, username, password });
  saveData();
  renderTeachers();
  updateDashboard();
}

function createStudent(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const sclass = document.getElementById("studentClass").value;
  data.students.push({ name, sclass });
  saveData();
  renderStudents();
  populateStudents();
  updateDashboard();
}

function renderTeachers() {
  const tbody = document.querySelector("#teacherTable tbody");
  tbody.innerHTML = "";
  data.teachers.forEach(t => {
    tbody.innerHTML += `<tr><td>${t.name}</td><td>${t.subjects.join(", ")}</td><td>${t.username}</td><td>${t.password}</td></tr>`;
  });
}

function renderStudents() {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";
  data.students.forEach(s => {
    tbody.innerHTML += `<tr><td>${s.name}</td><td>${s.sclass}</td></tr>`;
  });
}

function populateStudents() {
  const selects = ["markStudent", "attStudent"];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">Select Student</option>';
    data.students.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = `${s.name} (${s.sclass})`;
      sel.appendChild(opt);
    });
  });
}

function addMarks(e) { e.preventDefault(); /* similar to your original, using data.marks */ }
function addAttendance(e) { e.preventDefault(); /* similar */ }

function renderAll() {
  renderTeachers(); renderStudents();
  // renderMarks(), renderAttendance()
  updateDashboard();
}

function updateDashboard() {
  document.getElementById("totalTeachers").textContent = data.teachers.length;
  document.getElementById("totalStudents").textContent = data.students.length;
  document.getElementById("totalMarks").textContent = data.marks.length;
  document.getElementById("totalAttendance").textContent = data.attendance.length;
}

function saveData() {
  localStorage.setItem(LS, JSON.stringify(data));
}

function exportCSV() {
  let csv = "Student,Class,Score,Attendance\n";
  data.students.forEach(s => {
    const mark = data.marks.find(m => m.studentName === s.name)?.score || "";
    const att = data.attendance.find(a => a.studentName === s.name)?.status || "";
    csv += `"${s.name}","${s.sclass}",${mark},${att}\n`;
  });
  downloadFile(csv, "shule-report.csv", "text/csv");
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Shule ERP - Student Report", 20, 20);
  doc.setFontSize(12);
  let y = 40;
  data.students.forEach(s => {
    const mark = data.marks.find(m => m.studentName === s.name)?.score || "N/A";
    const att = data.attendance.find(a => a.studentName === s.name)?.status || "N/A";
    doc.text(`${s.name} (${s.sclass}) - Score: ${mark}, Attendance: ${att}`, 20, y);
    y += 10;
  });
  doc.save("shule-report.pdf");
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function logout() { location.reload(); }

// Load theme
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-mode");
