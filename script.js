let students = [];
let teachers = [];

function login(e) {
  e.preventDefault();
  const role = document.getElementById("role").value;

  document.getElementById("loginForm").style.display = "none";

  if (role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
  } else if (role === "teacher") {
    document.getElementById("teacherPanel").style.display = "block";
    refreshStudentDropdowns();
  }
}

function createTeacher(e) {
  e.preventDefault();
  const name = teacherName.value;
  const subject = teacherSubject.value;

  teachers.push({ name, subject });

  const li = document.createElement("li");
  li.textContent = `${name} - ${subject}`;
  teacherList.appendChild(li);

  e.target.reset();
}

function createStudent(e) {
  e.preventDefault();
  const name = studentName.value;
  const cls = studentClass.value;

  students.push({ name, cls });

  const li = document.createElement("li");
  li.textContent = `${name} (${cls})`;
  studentList.appendChild(li);

  refreshStudentDropdowns();
  e.target.reset();
}

function refreshStudentDropdowns() {
  markStudent.innerHTML = "<option value=''>Select Student</option>";
  attStudent.innerHTML = "<option value=''>Select Student</option>";

  students.forEach(s => {
    const opt1 = document.createElement("option");
    opt1.textContent = s.name;
    markStudent.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.textContent = s.name;
    attStudent.appendChild(opt2);
  });
}

function addMarks(e) {
  e.preventDefault();
  const student = markStudent.value;
  const score = markScore.value;

  const li = document.createElement("li");
  li.textContent = `${student}: ${score}`;
  marksList.appendChild(li);

  e.target.reset();
}

function addAttendance(e) {
  e.preventDefault();
  const student = attStudent.value;
  const status = attStatus.value;

  const li = document.createElement("li");
  li.textContent = `${student}: ${status}`;
  attendanceList.appendChild(li);

  e.target.reset();
}

