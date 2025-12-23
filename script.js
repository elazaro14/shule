// ===== Global State =====
let isLoggedIn = false;

// ===== Login Logic =====
document.getElementById("loginBtn").addEventListener("click", async () => {
    const role = document.getElementById("role").value;
    const user = document.getElementById("username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value.trim();

    // Logic for Admin and Teacher
    const isAdmin = role === "admin" && user === "elazaro14" && pass === "503812el";
    
    // For teachers, we fetch the CSV to verify the username
    let teachers = await fetchCSV("teachers.csv");
    const isTeacher = role === "teacher" && pass === "Olmotiss" && 
                      teachers.some(t => generateUsername(t.Name) === user);

    if (isAdmin || isTeacher) {
        isLoggedIn = true;
        
        // 1. Hide Login
        document.getElementById("loginSection").classList.add("hide");
        
        // 2. Show App
        document.getElementById("mainHeader").classList.remove("hide");
        document.getElementById("mainContent").classList.remove("hide");
        
        // 3. Enter App
        location.hash = "#/dashboard";
        router();
    } else {
        alert("Incorrect username or password.");
    }
});

// ===== Router Protection =====
function router() {
    // If not logged in, force them back to the login screen
    if (!isLoggedIn) {
        document.getElementById("loginSection").classList.remove("hide");
        document.getElementById("mainHeader").classList.add("hide");
        document.getElementById("mainContent").classList.add("hide");
        return;
    }

    const route = location.hash || "#/dashboard";
    const views = document.querySelectorAll(".view");
    views.forEach(v => v.classList.add("hide"));

    const map = {
        "#/dashboard": "view-dashboard",
        "#/teachers": "view-teachers",
        "#/students": "view-students",
        "#/performance": "view-performance",
        "#/attendance": "view-attendance",
        "#/print": "view-print",
    };

    const id = map[route] || "view-dashboard";
    const targetView = document.getElementById(id);
    if (targetView) targetView.classList.remove("hide");

    // Run specific loaders
    if (route === "#/dashboard") loadCounts();
    if (route === "#/teachers") loadTeachers();
}

// ===== Logout =====
document.getElementById("logoutBtn").addEventListener("click", () => {
    isLoggedIn = false;
    location.hash = ""; // Clear hash
    location.reload();  // Hard refresh to lock the app again
});

window.addEventListener("hashchange", router);
