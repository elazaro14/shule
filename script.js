// Inside your data structure (already have data = { teachers: [], students: [] })

function createTeacher(e) {
  e.preventDefault();
  const name = document.getElementById("teacherName").value.trim();
  const sex = document.getElementById("teacherSex").value;
  const subjects = Array.from(document.getElementById("teacherSubjects").selectedOptions)
                    .map(o => o.value);
  const assignedClass = document.getElementById("teacherClass").value;
  const isClassTeacher = document.getElementById("roleClassTeacher").checked;
  const isSubjectTeacher = document.getElementById("roleSubjectTeacher").checked;

  if (!name || !sex || subjects.length === 0 || !assignedClass) {
    alert("Please fill all fields");
    return;
  }

  // Generate username: firstname.lastname (lowercase)
  const nameParts = name.trim().split(" ");
  const first = nameParts[0].toLowerCase();
  const last = nameParts.slice(-1)[0].toLowerCase();
  let username = `${first}.${last}`;
  let counter = 1;
  while (data.teachers.some(t => t.username === username)) {
    username = `${first}.${last}${counter}`;
    counter++;
  }

  const password = "Olmotiss"; // Default - you can make it random or customizable later

  const roles = [];
  if (isClassTeacher) roles.push("Class Teacher");
  if (isSubjectTeacher) roles.push("Subject Teacher");

  data.teachers.push({
    name, sex, subjects, assignedClass, roles, username, password
  });

  saveData();
  renderTeachers();
  updateDashboard();
  e.target.reset();
}

function createStudent(e) {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const sex = document.getElementById("studentSex").value;
  const sclass = document.getElementById("studentClass").value;

  if (!name || !sex || !sclass) {
    alert("Please fill all fields");
    return;
  }

  data.students.push({ name, sex, sclass });
  saveData();
  renderStudents();
  populateStudents(); // Update dropdowns in teacher panel
  updateDashboard();
  e.target.reset();
}

function renderTeachers() {
  const tbody = document.querySelector("#teacherTable tbody");
  tbody.innerHTML = "";
  data.teachers.forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.name}</td>
      <td>${t.sex}</td>
      <td>${t.subjects.join(", ")}</td>
      <td>${t.assignedClass}</td>
      <td>${t.roles.join(", ")}</td>
      <td>${t.username}</td>
      <td>${t.password}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderStudents() {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";
  data.students.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.sex}</td>
      <td>${s.sclass}</td>
    `;
    tbody.appendChild(row);
  });
}
