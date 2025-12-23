// Function to save scores from the editable table to the global data object
function finalizeScores() {
  const tbody = document.querySelector("#subjectReportTable tbody");
  const rows = tbody.querySelectorAll("tr");
  const subject = document.getElementById("teacherSubjectHeader").textContent.toLowerCase();
  
  rows.forEach(row => {
    const studentName = row.cells[1].textContent.trim();
    const scores = {
      test1: row.cells[2].textContent.trim(),
      midTerm: row.cells[3].textContent.trim(),
      test2: row.cells[4].textContent.trim(),
      exam: row.cells[5].textContent.trim(),
      average: row.cells[6].textContent.trim(),
      grade: row.cells[7].textContent.trim(),
      date: new Date().toLocaleDateString()
    };

    // Find the student in the global data object
    const studentIndex = data.students.findIndex(s => s.name.toUpperCase() === studentName.toUpperCase());
    
    if (studentIndex !== -1) {
      // Initialize scores object if it doesn't exist
      if (!data.students[studentIndex].performance) {
        data.students[studentIndex].performance = {};
      }
      // Save scores under the specific subject
      data.students[studentIndex].performance[subject] = scores;
    }
  });

  saveData(); // Commit to LocalStorage
  alert("Scores for " + subject.toUpperCase() + " have been permanently saved!");
}

// Update loadTeacherReport to retrieve existing scores if they exist
function loadTeacherReport(teacher) {
  const assignedClass = teacher.assignedClass;
  const subject = teacher.subjects[0].toLowerCase();
  const classStudents = data.students.filter(s => s.sclass === assignedClass);

  const tbody = document.querySelector("#subjectReportTable tbody");
  tbody.innerHTML = "";

  classStudents.forEach((s, i) => {
    // Check if there are already saved scores for this subject
    const saved = (s.performance && s.performance[subject]) ? s.performance[subject] : {};

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

  // Re-attach calculation listeners
  document.querySelectorAll(".score-input").forEach(cell => {
    cell.addEventListener("input", function() {
      calculateRowAverage(this.closest("tr"));
    });
  });
}
