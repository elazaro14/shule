function loadTeacherReport(teacher) {
  const assignedClass = teacher.assignedClass;
  // We assume teacher.subjects is an array, e.g., ["Mathematics"]
  const primarySubject = teacher.subjects[0].toLowerCase();
  
  // 1. FILTERING LOGIC
  // Both roles only see students in their 'assignedClass'
  const classStudents = data.students.filter(s => s.sclass === assignedClass);
  
  const tbody = document.querySelector("#subjectReportTable tbody");
  const teacherHeader = document.getElementById("teacherSubjectHeader");
  teacherHeader.textContent = primarySubject.toUpperCase();
  tbody.innerHTML = "";

  classStudents.forEach((s, i) => {
    // Get saved scores for the specific subject the teacher teaches
    const saved = (s.performance && s.performance[primarySubject]) ? s.performance[primarySubject] : {};

    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name.toUpperCase()}</td>
        <td contenteditable="true" class="score-input">${saved.test1 || ""}</td>
        <td contenteditable="true" class="score-input">${saved.midTerm || ""}</td>
        <td contenteditable="true" class="score-input">${saved.test2 || ""}</td>
        <td contenteditable="true" class="score-input">${saved.exam || ""}</td>
        <td class="average">${saved.average || "0"}</td>
        <td class="grade">${saved.grade || "F"}</td>
      </tr>`;
  });

  // 2. CLASS TEACHER PRIVILEGE: Master Score Sheet Button
  const isClassTeacher = teacher.roles.includes("Class Teacher");
  const masterBtn = document.getElementById("generateMasterSheetBtn");
  
  if (isClassTeacher) {
    masterBtn.style.display = "inline-block";
  } else {
    masterBtn.style.display = "none";
  }

  // Attach calculation listeners
  document.querySelectorAll(".score-input").forEach(cell => {
    cell.addEventListener("input", function() {
      calculateRowAverage(this.closest("tr"));
    });
  });
}

// Function for Class Teachers to see ALL subjects for their class
function generateMasterScoreSheet() {
  const teacher = currentTeacher;
  const className = teacher.assignedClass;
  const classStudents = data.students.filter(s => s.sclass === className);
  
  // Get all unique subjects from all teachers to build table columns
  const allSubjects = [...new Set(data.teachers.flatMap(t => t.subjects))];

  let modalHTML = `
    <div id="masterSheetModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
        <h2>Master Score Sheet - ${className}</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Student Name</th>
              ${allSubjects.map(sub => `<th>${sub} (Avg)</th>`).join('')}
              <th>Overall Average</th>
            </tr>
          </thead>
          <tbody>
            ${classStudents.map(s => {
              let totalAvg = 0;
              let subCount = 0;
              return `
                <tr>
                  <td>${s.name}</td>
                  ${allSubjects.map(sub => {
                    const score = s.performance && s.performance[sub.toLowerCase()] ? s.performance[sub.toLowerCase()].average : "-";
                    if (score !== "-") { totalAvg += parseFloat(score); subCount++; }
                    return `<td>${score}</td>`;
                  }).join('')}
                  <td>${subCount > 0 ? (totalAvg / subCount).toFixed(1) : "0"}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
        <button onclick="window.print()" class="btn-success">Print Master Sheet</button>
      </div>
    </div>`;
    
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}
