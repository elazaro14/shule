// ===== CSV Utilities =====
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] ?? "");
    return obj;
  });
}

async function fetchCSV(path) {
  const res = await fetch("data/" + path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const text = await res.text();
  return parseCSV(text);
}

// ===== Teacher Username Generator =====
function generateUsername(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return parts[0].toLowerCase();
  const first = parts[0].toLowerCase();
  const last = parts[parts.length - 1].toLowerCase();
  return `${first}.${last}`;
}

// ===== Global State =====
let teachersList = [];
let studentsList = [];

// ===== Login Logic =====
async function ensureTeachersLoaded() {
  if (teachersList.length === 0) {
    teachersList = await fetchCSV("teachers.csv");
    console.log("Teacher usernames:", teachersList.map(t => generateUsername(t.Name)));
  }
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  await ensureTeachersLoaded();

  const role = document.getElementById("role").value;
  const user = document.getElementById("username").value.trim().toLowerCase();
  const pass = document.getElementById("password").value.trim();

  const okAdmin = role === "admin" && user === "elazaro14" && pass === "503812el";
  const okTeacher = role === "teacher" && pass === "Olmotiss" &&
    teachersList.some(t => generateUsername(t.Name) === user);

  if (okAdmin || okTeacher) {
    document.getElementById("loginSection").classList.add("hide");
    document.getElementById("mainHeader").classList.remove("hide");
    location.hash = "#/dashboard";
    router();
  } else {
    alert("Invalid login details. Check username and password.");
  }
});

// ===== Logout =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  document.getElementById("mainHeader").classList.add("hide");
  document.querySelectorAll(".view").forEach(v => v.classList.add("hide"));
  document.getElementById("loginSection").classList.remove("hide");
});

// ===== Router =====
function markActiveNav() {
  const nav = document.querySelectorAll(".nav a");
  const here = location.hash || "#/dashboard";
  nav.forEach(a => a.classList.remove("active"));
  const activeLink = Array.from(nav).find(a => a.getAttribute("href") === here);
  if (activeLink) activeLink.classList.add("active");
}

function router() {
  const route = location.hash || "#/dashboard";
  const views = document.querySelectorAll(".view");
  views.forEach(v => v.classList.add("hide"));
  const map = {
    "#/dashboard": "view-dashboard",
    "#/teachers": "view-teachers",
    "#/students": "view-students",
    "#/performance": "view-performance",
    "#/attendance": "view-attendance",
    "#/print": "view-print",
  };
  const id = map[route] || "view-dashboard";
  document.getElementById(id).classList.remove("hide");

  if (route === "#/dashboard") loadCounts();
  if (route === "#/teachers") loadTeachers();
  if (route === "#/students") loadStudents();
  if (route === "#/performance") initPerformance();
  if (route === "#/attendance") loadAttendance();
  if (route === "#/print") initPrint();
}

window.addEventListener("hashchange", () => {
  markActiveNav();
  router();
});

// ===== Dashboard =====
async function loadCounts() {
  const [teachers, students] = await Promise.all([
    fetchCSV("teachers.csv"),
    fetchCSV("students.csv")
  ]);
  document.getElementById("teacherCount").textContent = teachers.length;
  document.getElementById("studentCount").textContent = students.length;
  document.getElementById("updatedAt").textContent = new Date().toLocaleString();
}

// ===== Teachers =====
async function loadTeachers() {
  teachersList = await fetchCSV("teachers.csv");
  const tbody = document.querySelector("#teachersTable tbody");
  tbody.innerHTML = "";
  teachersList.forEach((t, i) => {
    const username = generateUsername(t.Name || "");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.Name || ""}</td>
      <td>${t.Sex || ""}</td>
      <td>${t.Subject || ""}</td>
      <td>${t.Class || ""}</td>
      <td>${t.Role || ""}</td>
      <td>${username}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== Students =====
async function loadStudents() {
  studentsList = await fetchCSV("students.csv");
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = "";
  studentsList.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.Name || ""}</td>
      <td>${s.Sex || ""}</td>
      <td>${s.Class || ""}</td>
      <td>${s.ExamNo || ""}</td>
      <td>${s.Phone || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== Performance =====
function initPerformance() {
  const formSelect = document.getElementById("formSelect");
  document.getElementById("reloadPerf").onclick = () => loadPerformance(formSelect.value);
  document.getElementById("printPerfBtn").onclick = () => window.print();
  loadPerformance(formSelect.value);
}

async function loadPerformance(form) {
  const rows = await fetchCSV(`${form}.csv`);
  const tbody = document.querySelector("#performanceTable tbody");
  const divBody = document.querySelector("#divisionSummary tbody");
  tbody.innerHTML = "";
  divBody.innerHTML = "";

  rows.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.Name || ""}</td>
      <td>${s.Test1 || ""}</td>
      <td>${s.MidTerm || ""}</td>
      <td>${s.Test2 || ""}</td>
      <td>${s.Exam || ""}</td>
      <td>${s.Average || ""}</td>
      <td>${s.Division || ""}</td>
      <td>${s.Points || ""}</td>
    `;
    tbody.appendChild(tr);
  });

  const summary = {};
  rows.forEach(s => {
    const div = (s.Division || "").toUpperCase();
    summary[div] = (summary[div] || 0) + 1;
  });
  Object.entries(summary).forEach(([k,v]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
    divBody.appendChild(tr);
  });
}

// ===== Attendance =====
async function loadAttendance() {
  const students = await fetchCSV("students.csv");
  const tbody = document.querySelector("#attendanceTable tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.Name || ""}</td>
      <td>
        <select class="input">
          <option>Present</option>
          <option>Absent</option>
        </select>
      </td>
      <td><button class="btn btn-secondary">Save</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== Print (RIPOTI) =====
async function initPrint() {
  const formSelect = document.getElementById("printForm");
  const studentSelect = document.getElementById("printStudent");
  const printBtn = document.getElementById("printBtn");

  const students = await fetchCSV("students.csv");
  studentSelect.innerHTML = "";
  students.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.Name;
    opt.textContent = s.Name;
    studentSelect.appendChild(opt);
  });

  printBtn.onclick = async
