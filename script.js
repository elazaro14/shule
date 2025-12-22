function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (role === "admin") {
    if (username === admin.username && password === admin.password) {
      currentRole = "admin";
      startApp();
      return;
    }
  } else if (role === "teacher") {
    const teacher = data.teachers.find(t => t.username === username && t.password === password);
    if (teacher) {
      currentRole = "teacher";
      startApp();
      return;
    }
  }

  alert("Invalid username or password. Please try again.");
}
