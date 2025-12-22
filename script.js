// RENDER TEACHERS TABLE
function renderTeachers() {
  const tbody = document.getElementById("teacherTable").querySelector("tbody");
  tbody.innerHTML = "";
  teachers.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${t.name}</td><td>${t.subject}</td><td>${t.username}</td><td>${t.password}</td>`;
    tbody.appendChild(tr);
  });
}

// RENDER STUDENTS TABLE
function renderStudents() {
  const tbody = document.getElementById("studentTable").querySelector("tbody");
  tbody.innerHTML = "";
  students.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.name}</td><td>${s.sclass}</td>`;
    tbody.appendChild(tr);
  });
}
