// ADMIN CREDENTIALS
const ADMIN_USERNAME = "elazaro14";
const ADMIN_PASSWORD = "503812el";

function login(e) {
  e.preventDefault();

  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const r = document.getElementById("role").value;

  if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD && r === "admin") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
  } else {
    document.getElementById("loginError").innerText = "Invalid username or password";
  }
}

function logout() {
  location.reload();
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(page).style.display = "block";
}

/* TEACHERS */
function addTeacher(e) {
  e.preventDefault();

  const name = tName.value;
  const subject = tSubject.value;
  const role = tRole.value;
  const cls = tClass.value || "N/A";

  const li = document.createElement("li");
  li.textContent = `${name} | ${subject} | ${role} | ${cls}`;
  teacherList.appendChild(li);

  e.target.reset();
}

/* STUDENTS */
function addStudent(e) {
  e.preventDefault();

  const name = sName.value;
  const cls = sClass.value;

  const li = document.createElement("li");
  li.textContent = `${name} - ${cls}`;
  studentList.appendChild(li);

  e.target.reset();
}
