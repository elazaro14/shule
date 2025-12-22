const admin = { username: "elazaro14", password: "503812el" };
const LS = "shule_data";
let data = JSON.parse(localStorage.getItem(LS)) || { teachers: [], students: [], scores: {} };
let currentRole = null;

function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin" && username === admin.username && password === admin.password) {
    currentRole = "admin";
    startApp();
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
  showPanel('dashboard');
}

function importExcel() {
  const fileInput = document.getElementById("excelUpload");
  const file = fileInput.files[0];
  if (!file) return alert("Select your MUFUMO ANN25.xlsx file");

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataArray = new Uint8Array(e.target.result);
    const workbook = XLSX.read(dataArray, { type: "array" });

    const formSheets = ["F1", "F11", "F2", "F22", "F3", "F33", "F4", "F44"];
    const formNames = ["Form 1", "Form 1", "Form 2", "Form 2", "Form 3", "Form 3", "Form 4", "Form 4"];

    formSheets.forEach((sheet, index) => {
      if (workbook.Sheets[sheet]) {
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 });
        const rows = json.slice(1).filter(r => r[2]); // Skip header, filter by name
        data.scores[formNames[index]] = rows.map(row => ({
          sn: row[0] || "",
          examNo: row[1] || "",
          name: row[2] || "",
          sex: row[3] || "",
          scores: row.slice(5) // Adjust if needed
        }));
      }
    });

    saveData();
    alert("Excel imported successfully! Go to Scores & Reports to view.");
  };
  reader.readAsArrayBuffer(file);
}

function loadScores() {
  const form = document.getElementById("selectForm").value;
  if (!form) return alert("Select a form");

  const container = document.getElementById("scoresTableContainer");
  const scores = data.scores[form] || [];
  if (scores.length === 0) return container.innerHTML = "<p>No scores imported for this form yet.</p>";

  let table = `<h3>${form} Scores</h3><table class="table"><thead><tr><th>S/N</th><th>Name</th><th>Sex</th><th>Scores</th></tr></thead><tbody>`;
  scores.forEach(s => {
    table += `<tr><td>${s.sn}</td><td>${s.name}</td><td>${s.sex}</td><td>${s.scores.join(" | ")}</td></tr>`;
  });
  table += `</tbody></table>`;
  container.innerHTML = table;

  // Populate student dropdown for report
  const select = document.getElementById("reportStudent");
  select.innerHTML = "<option>Select Student</option>";
  scores.forEach(s => select.innerHTML += `<option>${s.name}</option>`);
}

function generateReportCard() {
  const studentName = document.getElementById("reportStudent").value;
  if (!studentName) return alert("Select a student");

  const form = document.getElementById("selectForm").value;
  const student = (data.scores[form] || []).find(s => s.name === studentName);
  if (!student) return alert("Student not found");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("SHULE YA SEKONDARI OLMOTI", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("TAARIFA YA MAENDELEO YA MWANAFUNZI", 105, 35, { align: "center" });

  doc.setFontSize(12);
  doc.text(`JINA: ${student.name}`, 20, 60);
  doc.text(`JINSIA: ${student.sex}`, 20, 70);
  doc.text(`DARASA: ${form}`, 20, 80);
  doc.text("ALAMA ZA MWANAFUNZI:", 20, 100);
  // Add scores (customize as needed)
  let y = 110;
  student.scores.forEach((score, i) => {
    doc.text(`Subject ${i+1}: ${score}`, 30, y);
    y += 10;
  });

  doc.text("Mzazi/Mlezi: ________________________ Sahihi: _______________ Tarehe: ___________", 20, y + 30);

  doc.save(`${student.name}-report-card.pdf`);
}

function createTeacher(e) { /* Your existing teacher code */ }
function createStudent(e) { /* Your existing student code */ }
function renderTeachers() { /* Your existing render */ }
function renderStudents() { /* Your existing render */ }
function updateDashboard() { /* Your existing */ }
function showPanel(id) { document.querySelectorAll(".panel").forEach(p => p.style.display = "none"); document.getElementById(id).style.display = "block"; }
function saveData() { localStorage.setItem(LS, JSON.stringify(data)); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
function logout() { location.reload(); }
