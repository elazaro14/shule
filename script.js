const adminAccount = {
  username: "elazaro14",
  password: "503812el"
};

let teachers = [];
let currentUser = null;

function login() {
  const u = username.value;
  const p = password.value;
  const r = role.value;
  loginError.textContent = "";

  if (r === "admin") {
    if (u === adminAccount.username && p === adminAccount.password) {
      openDashboard("admin");
    } else {
      loginError.textContent = "Invalid admin credentials";
    }
  }

  if (r === "teacher") {
    const t = teachers.find(x => x.username === u && p === "teacher123");
    if (t) {
      currentUser = t;
      openDashboard("teacher");
      teacherInfo.textContent =
        `Name: ${t.name} | Role: ${t.role} | Subject: ${t.subject} | Class: ${t.class}`;
    } else {
      loginError.textContent = "Invalid teacher login";
    }
  }
}

function openDashboard(type) {
  loginPage.style.display = "none";
  dashboard.style.display = "flex";
  showPage("home");

  adminBtn.style.display = type === "admin" ? "block" : "none";
  teacherBtn.style.display = type === "teacher" ? "block" : "none";
}

function showPage(p) {
  document.querySelectorAll(".page").forEach(x => x.style.display = "none");
  document.getElementById(p).style.display = "block";
}

function logout() {
  location.reload();
}

function addTeacher() {
  const name = tName.value;
  const subject = tSubject.value;
  const role = tRole.value;
  const cls = tClass.value;

  const username = name.toLowerCase().replace(" ", "") + teachers.length;

  const teacher = {
    name,
    subject,
    role,
    class: cls,
    username
  };

  teachers.push(teacher);

  teacherList.innerHTML += `
    <li>
      ${name} | ${subject} | ${role} | ${cls}
      <br>Username: <b>${username}</b> | Password: <b>teacher123</b>
    </li>
  `;

  tName.value = tSubject.value = tRole.value = tClass.value = "";
}
