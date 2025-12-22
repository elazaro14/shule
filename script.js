function createTeacher(e) {
  e.preventDefault(); // <-- THIS STOPS THE PAGE RELOAD!

  const name = document.getElementById("teacherName").value.trim();
  const sex = document.getElementById("teacherSex").value;
  const subjects = Array.from(document.getElementById("teacherSubjects").selectedOptions).map(o => o.value);
  const assignedClass = document.getElementById("teacherClass").value;
  const isClassTeacher = document.getElementById("roleClassTeacher").checked;
  const isSubjectTeacher = document.getElementById("roleSubjectTeacher").checked;

  if (!name || !sex || subjects.length === 0 || !assignedClass) {
    alert("Please fill all required fields");
    return;
  }

  // Generate username
  const parts = name.split(" ");
  const first = parts[0].toLowerCase();
  const last = parts[parts.length - 1].toLowerCase();
  let username = `${first}.${last}`;
  let i = 1;
  while (data.teachers.some(t => t.username === username)) {
    username = `${first}.${last}${i++}`;
  }

  const roles = [];
  if (isClassTeacher) roles.push("Class Teacher");
  if (isSubjectTeacher) roles.push("Subject Teacher");

  data.teachers.push({
    name, sex, subjects, assignedClass, roles, username, password: "Olmotiss"
  });

  saveData();
  renderTeachers();
  updateDashboard();
  e.target.reset(); // Clears the form
  alert("Teacher added successfully!");
}

function createStudent(e) {
  e.preventDefault(); // <-- THIS STOPS THE PAGE RELOAD!

  const name = document.getElementById("studentName").value.trim();
  const sex = document.getElementById("studentSex").value;
  const sclass = document.getElementById("studentClass").value;

  if (!name || !sex || !sclass) {
    alert("Please fill all required fields");
    return;
  }

  data.students.push({ name, sex, sclass });
  saveData();
  renderStudents();
  updateDashboard();
  e.target.reset();
  alert("Student added successfully!");
}
