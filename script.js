const adminUser = "elazaro14";
const adminPass = "503812el";

let teachers = [];
let currentTeacher = null;

function login(e) {
  e.preventDefault();

  const u = username.value;
  const p = password.value;
  const r = role.value;

  if (r === "admin" && u === adminUser && p === adminPass) {
    openDashboard("admin");
  } 
  else if (r === "teacher") {
    const teacher = teachers.find(t => t.username === u && p === "teacher123");
    if (teacher) {
      currentTeacher = teacher;
      openDashboard("teacher");
      teacherInfo.innerText =
        `Name: ${teacher.name} | Subject: ${teacher.subject} | Role: ${teacher.role} | Class: ${teacher.class}`;
    } else {
      alert("Invalid teacher login");
    }
  } 
  else {
    alert("Invalid login");
  }
}

function openDashboard(type) {
  loginPage.style.display = "none";
  dashboard.style.display = "block";
  adminLink.style.display = type === "admin" ? "block" : "none";
  teacherLink.style.display = type === "teacher" ? "block" : "none";
  showPage("home");
}

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function logout() {
  location.reload();
}

function addTeacher(e) {
  e.preventDefault();

  const name = tName.value;
  const subject = tSubject.value;
  const role = tRole.value;
  const cls = tClass.value;

  const username = name.toLowerCase().replace(/\s/g, "");

  teachers.push({
    name,
    subject,
    role,
    class: cls,
    username
  });

  teacherList.innerHTML += `
    <li>${name} | ${subject} | ${role} | ${cls} | Username: <b>${username}</b></li>
  `;

  alert("Teacher registered.\nPassword: teacher123");
}

function saveMarks() {
  marksList.innerHTML += `<li>${studentName.value} - ${marks.value}</li>`;
}
