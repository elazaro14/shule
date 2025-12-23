const admin = { username: "elazaro14", password: "503812el" };

let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
let students = JSON.parse(localStorage.getItem("students")) || [];

function save() {
  localStorage.setItem("teachers", JSON.stringify(teachers));
  localStorage.setItem("students", JSON.stringify(students));
}

function login(e) {
  e.preventDefault();
  const u = username.value;
  const p = password.value;
  const r = role.value;

  if (r === "admin" && u === admin.username && p === admin.password) {
    loginBox.style.display = "none";
    dashboard.style.display = "block";
    adminPanel.style.display = "block";
    render();
  } 
  else if (r === "teacher") {
    const t = teachers.find(x => x.username === u && x.password === p);
    if (!t) return alert("Invalid teacher login");
    loginBox.style.display = "none";
    dashboard.style.display = "block";
    teacherPanel.style.display = "block";
  } 
  else alert("Invalid login");
}

function addTeacher(e) {
  e.preventDefault();
  const name = tName.value.trim();
  const uname = name.toLowerCase().replace(/\s+/g, "");
  teachers.push({
    name,
    subject: tSubject.value,
    class: tClass.value,
    username: uname,
    password: "Olmotiss"
  });
  save(); render(); e.target.reset();
}

function addStudent(e) {
  e.preventDefault();
  students.push({
    name: sName.value,
    class: sClass.value
  });
  save(); render(); e.target.reset();
}

function render() {
  teacherTable.innerHTML = "";
  studentTable.innerHTML = "";

  teachers.forEach(t => {
    teacherTable.innerHTML += `
      <tr>
        <td>${t.name}</td><td>${t.subject}</td><td>${t.class}</td>
        <td>${t.username}</td><td>${t.password}</td>
      </tr>`;
  });

  students.forEach(s => {
    studentTable.innerHTML += `
      <tr><td>${s.name}</td><td>${s.class}</td></tr>`;
  });

  tCount.textContent = teachers.length;
  sCount.textContent = students.length;
}
