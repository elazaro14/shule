// ---------- UTIL ----------
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
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const text = await res.text();
  return parseCSV(text);
}

function show(id) { document.getElementById(id).classList.remove("hide"); }
function hide(id) { document.getElementById(id).classList.add("hide"); }
function setTheme(next) { document.body.className = next; }

// ---------- AUTH ----------
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const logoutBtn = document.getElementById("logoutBtn");
const toggleTheme = document.getElementById("toggleTheme");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const role = document.getElementById("role").value;
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  const okAdmin = role === "admin" && user === "elazaro14" && pass === "503812el";
  const okTeacher = role === "teacher" && user === "Olmotiss" && pass === "503812el";

  if (okAdmin || okTeacher) {
    hide("loginSection");
    show("dashboardSection");
    // Default: show performance section
    show("performanceSection");
    loadCounts();
    initTabs(role);
    initData();
  } else {
    alert("Taarifa za kuingia si sahihi.");
  }
});

logoutBtn.addEventListener("click", () => {
  show("loginSection");
  hide("dashboardSection");
  hide("adminSection");
  hide("performanceSection");
  hide("attendanceSection");
  hide("printSection");
});

toggleTheme.addEventListener("click", () => {
  setTheme(document.body.className === "dark" ? "light" : "dark");
});

// ---------- TABS ----------
function initTabs(role) {
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      ["adminSection", "performanceSection", "attendanceSection", "printSection"].forEach(id => hide(id));
      show(target);
    });
  });

  if (role === "teacher") {
    hide("adminSection");
  }
}

// ---------- LOAD COUNTS ----------
async function loadCounts() {
  try {
    const teachers = await fetchCSV("data/teachers.csv");
    const students = await fetchCSV("data/students.csv");
    document.getElementById("teacherCount").textContent = String(teachers.length);
    document.getElementById("studentCount").textContent = String(students.length);
  } catch (e) {
    console.warn("Counts failed:", e.message);
  }
}

// ---------- ADMIN TABLES ----------
async function loadTeachers() {
  try {
    const teachers = await fetchCSV("data/teachers.csv");
    const tbody = document.querySelector("#teachersTable tbody");
    tbody.innerHTML = "";
    teachers.forEach((t, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${t.Name || ""}</td>
        <td>${t.Sex || ""}</td>
        <td>${t.Subject || ""}</td>
        <td>${t.Class || ""}</td>
        <td>${t.Role || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.warn("loadTeachers:", e.message);
  }
}

async function loadStudents() {
  try {
    const students = await fetchCSV("data/students.csv");
    const tbody = document.querySelector("#studentsTable tbody");
    tbody.innerHTML = "";
    students.forEach((s, i) => {
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
  } catch (e) {
    console.warn("loadStudents:", e.message);
  }
}

// ---------- PERFORMANCE ----------
const formSelect = document.getElementById("formSelect");
const reloadPerf = document.getElementById("reloadPerf");
const printPerfBtn = document.getElementById("printPerfBtn");

reloadPerf.addEventListener("click", () => loadPerformance(formSelect.value));
window.addEventListener("DOMContentLoaded", () => loadPerformance(formSelect.value));

async function loadPerformance(form) {
  try {
    const rows = await fetchCSV(`data/${form}.csv`);
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

    const summary = { I:0, II:0, III:0, IV:0, "0":0, F:0, M:0, TOTAL:rows.length };
    rows.forEach(s => {
      const div = (s.Division || "").toUpperCase();
      if (summary.hasOwnProperty(div)) summary[div]++;
    });

    Object.entries(summary).forEach(([k, v]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
      divBody.appendChild(tr);
    });

    printPerfBtn.onclick = () => window.print();
  } catch (e) {
    console.warn("loadPerformance:", e.message);
  }
}

// ---------- ATTENDANCE ----------
async function loadAttendance() {
  try {
    const students = await fetchCSV("data/students.csv");
    const tbody = document.querySelector("#attendanceTable tbody");
    tbody.innerHTML = "";
    students.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.Name || ""}</td>
        <td>
          <select>
            <option>Present</option>
            <option>Absent</option>
          </select>
        </td>
        <td><button class="btn btn-secondary">Hifadhi</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.warn("loadAttendance:", e.message);
  }
}

// ---------- PRINT VIEW ----------
const printForm = document.getElementById("printForm");
const printStudent = document.getElementById("printStudent");
const printBtn = document.getElementById("printBtn");
const printArea = document.getElementById("printArea");

printForm.addEventListener("change", async () => {
  const form = printForm.value;
  const rows = await fetchCSV(`data/${form}.csv`);
  printStudent.innerHTML = "";
  rows.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.ExamNo || r.Name;
    opt.textContent = r.Name;
    printStudent.appendChild(opt);
  });
});

printBtn.addEventListener("click", async () => {
  const form = printForm.value;
  const rows = await fetchCSV(`data/${form}.csv`);
  const key = printStudent.value;
  const rec = rows.find(r => (r.ExamNo || r.Name) === key);
  if (!rec) return alert("Mwanafunzi hajapatikana.");

  // Simple report card block — you can style more richly
  printArea.innerHTML = `
    <div>
      <h3>TAARIFA YA MAENDELEO YA MWANAFUNZI</h3>
      <p><b>Jina:</b> ${rec.Name || ""}</p>
      <p><b>Kidato:</b> ${form}</p>
      <p><b>Namba ya Mtihani:</b> ${rec.ExamNo || ""}</p>
      <hr />
      <table class="table">
        <thead><tr><th>Vipimo</th><th>Alama</th></tr></thead>
        <tbody>
          <tr><td>Test 1</td><td>${rec.Test1 || ""}</td></tr>
          <tr><td>Mid Term</td><td>${rec.MidTerm || ""}</td></tr>
          <tr><td>Test 2</td><td>${rec.Test2 || ""}</td></tr>
          <tr><td>Exam</td><td>${rec.Exam || ""}</td></tr>
          <tr><td>Wastani</td><td>${rec.Average || ""}</td></tr>
          <tr><td>Division</td><td>${rec.Division || ""}</td></tr>
          <tr><td>Points</td><td>${rec.Points || ""}</td></tr>
        </tbody>
      </table>
      <p class="hint">Maelezo: F = 0-29, D = 30-44, C = 45-64, B = 65-74, A = 75-100.</p>
    </div>
  `;
  window.print();
});

// ---------- INIT ----------
async function initData() {
  await Promise.all([
    loadTeachers(),
    loadStudents(),
    loadAttendance()
  ]);
  // Trigger initial population for print student list
  const event = new Event("change");
  printForm.dispatchEvent(event);
}
