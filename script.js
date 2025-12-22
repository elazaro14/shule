// FILTER TABLE
function filterTable(tableId, searchText) {
  const filter = searchText.toLowerCase();
  const rows = document.getElementById(tableId).getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) { // skip header
    let match = false;
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      if (cells[j].textContent.toLowerCase().includes(filter)) {
        match = true;
        break;
      }
    }
    rows[i].style.display = match ? "" : "none";
  }
}

// FILTER STUDENTS BY TEACHER (CLASS-wise)
function populateStudents(classFilter = null) {
  const markSelect = document.getElementById("markStudent");
  const attSelect = document.getElementById("attStudent");
  markSelect.innerHTML = '<option value="">Select Student</option>';
  attSelect.innerHTML = '<option value="">Select Student</option>';
  
  students.forEach(s => {
    if (!classFilter || s.sclass === classFilter) {
      const option = document.createElement("option");
      option.value = s.name;
      option.textContent = `${s.name} (${s.sclass})`;
      markSelect.appendChild(option.cloneNode(true));
      attSelect.appendChild(option.cloneNode(true));
    }
  });
}

// WHEN TEACHER LOGS IN, FILTER THEIR CLASS
function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  document.getElementById("loginForm").style.display = "none";
  document.getElementById("sidebar").style.display = "block";

  if (role === "admin" && username === admin.username && password === admin.password) {
    showPanel("dashboard");
    document.getElementById("adminPanel").style.display = "block";
    populateStudents(); // all students
  } else if (role === "teacher") {
    const teacher = teachers.find(t => t.username === username && t.password === password);
    if (!teacher) return alert("Invalid teacher credentials!");
    showPanel("dashboard");
    document.getElementById("teacherPanel").style.display = "block";

    // Filter students by teacher's subject/class (simplified: teacher sees all)
    populateStudents(); 
  } else {
    alert("Invalid credentials!");
  }

  updateDashboard();
}
;
