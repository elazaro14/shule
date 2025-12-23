// Utility: parse CSV text into array of objects
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}

// ---------------- PERFORMANCE REPORTS ----------------
async function loadPerformance(form) {
  const response = await fetch(`data/${form}.csv`);
  const text = await response.text();
  const students = parseCSV(text);

  const table = document.getElementById("performanceTable");
  students.forEach((s, i) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${i+1}</td>
      <td>${s.Name || ""}</td>
      <td>${s.Test1 || ""}</td>
      <td>${s.MidTerm || ""}</td>
      <td>${s.Test2 || ""}</td>
      <td>${s.Exam || ""}</td>
      <td>${s.Average || ""}</td>
      <td>${s.Division || ""}</td>
    `;
  });

  // Division Summary
  const summary = { I:0, II:0, III:0, IV:0, "0":0, F:0, M:0, TOTAL:students.length };
  students.forEach(s => {
    if (summary[s.Division] !== undefined) summary[s.Division]++;
  });
  const divTable = document.getElementById("divisionSummary");
  Object.keys(summary).forEach(key => {
    const row = divTable.insertRow();
    row.innerHTML = `<td>${key}</td><td>${summary[key]}</td>`;
  });
}

// ---------------- TEACHERS ----------------
async function loadTeachers() {
  const response = await fetch('data/teachers.csv');
  const text = await response.text();
  const teachers = parseCSV(text);

  const table = document.getElementById("teachersTable");
  teachers.forEach((t, i) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${i+1}</td>
      <td>${t.Name || ""}</td>
      <td>${t.Subject || ""}</td>
      <td>${t.Class || ""}</td>
    `;
  });
}

// ---------------- STUDENTS ----------------
async function loadStudents() {
  const response = await fetch('data/students.csv');
  const text = await response.text();
  const students = parseCSV(text);

  const table = document.getElementById("studentsTable");
  students.forEach((s, i) => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${i+1}</td>
      <td>${s.Name || ""}</td>
      <td>${s.Sex || ""}</td>
      <td>${s.Class || ""}</td>
    `;
  });

  // Attendance table
  const attTable = document.getElementById("attendanceTable");
  students.forEach((s, i) => {
    const row = attTable.insertRow();
    row.innerHTML = `
      <td>${s.Name || ""}</td>
      <td><select><option>Present</option><option>Absent</option></select></td>
      <td><button>Save</button></td>
    `;
  });
}

// ---------------- INITIAL LOAD ----------------
loadPerformance("F1");
loadPerformance("F2");
loadPerformance("F3");
loadTeachers();
loadStudents();
