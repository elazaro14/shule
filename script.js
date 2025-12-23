// Function to render the list of students in the Admin Report Panel
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
    <tr>
      <td>${i+1}</td>
      <td>${s.name.toUpperCase()}</td>
      <td>${s.sex}</td>
      <td>${s.sclass}</td>
      <td><button class="btn-primary" onclick="generateIndividualReport('${s.name}')">Generate Card</button></td>
    </tr>`).join("");
}

// Function to pull data from each subject and create the report card
function generateIndividualReport(studentName) {
  const s = db.students.find(student => student.name === studentName);
  if (!s) return;

  // Subject list based on Form
  const subjects = (s.sclass.includes("1") || s.sclass.includes("2")) 
    ? ["CIVICS", "HISTORY", "GEOGRAPHY", "KISWAHILI", "ENGLISH LANGUAGE", "PHYSICS", "CHEMISTRY", "BIOLOGY", "MATHEMATICS"]
    : ["CIVICS", "HISTORY", "GEOGRAPHY", "KISWAHILI", "ENGLISH LANGUAGE", "PHYSICS", "CHEMISTRY", "BIOLOGY", "MATHEMATICS", "COMMERCE", "BOOKKEEPING"];

  let rowsHtml = "";
  let totalMarks = 0;

  subjects.forEach(sub => {
    const perf = s.performance[sub.toLowerCase()] || { test: 0, exam: 0 };
    const test = parseFloat(perf.test) || 0;
    const exam = parseFloat(perf.exam) || 0;
    const total = test + exam;
    const avg = Math.round(total / 2);
    totalMarks += total;

    // Grading Scale from Image
    let grade = "F", remark = "FELI";
    if (total >= 75) { grade = "A"; remark = "VIZURI SANA"; }
    else if (total >= 65) { grade = "B"; remark = "VIZURI"; }
    else if (total >= 45) { grade = "C"; remark = "WASTANI"; }
    else if (total >= 30) { grade = "D"; remark = "INARIDHISHA"; }

    rowsHtml += `
      <tr>
        <td>${sub}</td>
        <td>${test || '-'}</td>
        <td>${exam || '-'}</td>
        <td><b>${total}</b></td>
        <td>${avg}</td>
        <td>${grade}</td>
        <td>${remark}</td>
      </tr>`;
  });

  // Create Print Window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Report Card - ${s.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          .header { margin-bottom: 20px; line-height: 1.2; }
          .student-info { text-align: left; margin-bottom: 10px; border: 1px solid black; padding: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid black; padding: 5px; font-size: 12px; }
          .footer-section { margin-top: 20px; text-align: left; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <strong>TAWALA ZA MIKOA NA SERIKALI ZA MTAA</strong><br>
          <strong>HALMASHAURI YA JIJI LA ARUSHA</strong><br>
          <strong>SHULE YA SEKONDARI OLMOTI</strong><br>
          S.L.P 8249, ARUSHA<br>
          <strong>TAARIFA YA MAENDELEO YA MWANAFUNZI</strong>
        </div>
        <div class="student-info">
          NAME: ${s.name.toUpperCase()} &nbsp;&nbsp; CLASS: ${s.sclass} &nbsp;&nbsp; YEAR: 2025
        </div>
        <table>
          <thead>
            <tr>
              <th>SOMO (SUBJECT)</th>
              <th>JARIBIO (TEST)</th>
              <th>MTIHANI (EXAM)</th>
              <th>JUMLA (TOTAL)</th>
              <th>WASTANI (AVG)</th>
              <th>DARAJA (GRADE)</th>
              <th>MAONI (REMARKS)</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot>
            <tr>
              <td><strong>JUMLA (TOTAL)</strong></td>
              <td colspan="2"></td>
              <td><strong>${totalMarks}</strong></td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
        <div class="footer-section">
          <strong>MAELEZO:</strong> F=0-29 (FELI), D=30-44 (INARIDHISHA), C=45-64 (WASTANI), B=65-74 (VIZURI), A=75-100 (VIZURI SANA)
          <br><br>
          Maoni ya Mwalimu wa Darasa: _________________________________________________
          <br>
          Maoni ya Mkuu wa Shule: ____________________________________________________
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
