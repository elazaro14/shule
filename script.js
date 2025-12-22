const adminUser = "elazaro14";
const adminPass = "503812el";

let teachers = [];
let students = [];

function login(e) {
  e.preventDefault();

  const u = username.value;
  const p = password.value;
  const r = role.value;

  if (r === "admin" && u === adminUser && p === adminPass) {
    openDashboard("admin");
  } 
  else if (r === "teacher") {
    const t = teachers.find(x => x.username === u && p === "teacher123");
    if (t) openDashboard("teacher");
    else errorMsg.innerText = "Invalid teacher login";
  } 
  else {
    errorMsg.innerText = "Invalid login details";
  }
}

function openDashboard(role) {
  loginPage.style.display = "none";
  dashboard.style.display = "flex";

  if (role === "teacher") {
    adminOnly1.style.display = "none";
    adminOnly2.style.display = "none";
  }
}

function logout() {
  location.reload();
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function addTeacher(e) {
  e.preventDefault();
  const name = tName.value;
  const teacher = {
    name,
    username: name.toLowerCase().replace(/\s/g, "")
  };
  teachers.push(teacher);
  teacherList.innerHTML += `<li>${name} (${tRole.value})</li>`;
}

function addStudent(e) {
  e.preventDefault();
  students.push(sName.value);
  studentList.innerHTML += `<li>${sName.value} - ${sClass.value}</li>`;
  markStudent.innerHTML += `<option>${sName.value}</option>`;
  attStudent.innerHTML += `<option>${sName.value}</option>`;
}

function addMarks(e) {
  e.preventDefault();
  marksList.innerHTML += `<li>${markStudent.value}: ${markScore.value}</li>`;
}

function addAttendance(e) {
  e.preventDefault();
  attendanceList.innerHTML += `<li>${attStudent.value}: ${attStatus.value}</li>`;
}
