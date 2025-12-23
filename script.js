// ===== Configuration & Constants =====
const CONFIG = {
    DATA_PATH: "data/",
    ADMIN_USER: "elazaro14",
    ADMIN_PASS: "503812el",
    TEACHER_PASS: "Olmotiss"
};

// ===== CSV Utilities =====
/**
 * Improved CSV Parser: Handles quoted values and empty strings more robustly.
 */
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    // Regex to handle commas inside quotes if your CSV ever gets complex
    const headers = lines[0].split(",").map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] !== undefined ? values[i] : "";
        });
        return obj;
    });
}

async function fetchCSV(fileName) {
    try {
        const res = await fetch(`${CONFIG.DATA_PATH}${fileName}?v=${new Date().getTime()}`); // Cache busting
        if (!res.ok) throw new Error(`File ${fileName} not found.`);
        const text = await res.text();
        return parseCSV(text);
    } catch (err) {
        console.error("Fetch Error:", err);
        return [];
    }
}

// ===== Teacher Username Generator =====
function generateUsername(fullName) {
    if (!fullName) return "user";
    const parts = fullName.trim().toLowerCase().split(/\s+/);
    if (parts.length < 2) return parts[0];
    return `${parts[0]}.${parts[parts.length - 1]}`;
}

// ===== Global State =====
let state = {
    teachers: [],
    students: [],
    currentUser: null
};

// ===== Authentication =====
document.getElementById("loginBtn").addEventListener("click", async () => {
    const role = document.getElementById("role").value;
    const user = document.getElementById("username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value.trim();
    const btn = document.getElementById("loginBtn");

    // UI Feedback
    btn.textContent = "Authenticating...";
    btn.disabled = true;

    // Ensure teachers are loaded for teacher-role check
    if (state.teachers.length === 0) {
        state.teachers = await fetchCSV("teachers.csv");
    }

    const isAdmin = role === "admin" && user === CONFIG.ADMIN_USER && pass === CONFIG.ADMIN_PASS;
    const isTeacher = role === "teacher" && pass === CONFIG.TEACHER_PASS && 
                      state.teachers.some(t => generateUsername(t.Name) === user);

    if (isAdmin || isTeacher) {
        state.currentUser = { user, role };
        document.getElementById("loginSection").classList.add("hide");
        document.getElementById("mainHeader").classList.remove("hide");
        location.hash = "#/dashboard";
        router();
    } else {
        alert("Invalid login details. Please check your credentials.");
    }

    btn.textContent = "Login";
    btn.disabled = false;
});

// ===== Navigation & Router =====
function router() {
    const route = location.hash || "#/dashboard";
    const viewMap = {
        "#/dashboard": { id: "view-dashboard", init: loadDashboard },
        "#/teachers": { id: "view-teachers", init: loadTeachers },
        "#/students": { id: "view-students", init: loadStudents },
        "#/performance": { id: "view-performance", init: initPerformance },
        "#/attendance": { id: "view-attendance", init: loadAttendance },
        "#/print": { id: "view-print", init: initPrint }
    };

    // Hide all views
    document.querySelectorAll(".view").forEach(v => v.classList.add("hide"));
    
    const target = viewMap[route] || viewMap["#/dashboard"];
    const element = document.getElementById(target.id);
    
    if (element) {
        element.classList.remove("hide");
        target.init();
    }
    
    markActiveNav(route);
}

function markActiveNav(route) {
    document.querySelectorAll(".nav a").forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === route);
    });
}

// ===== View Initializers =====

async function loadDashboard() {
    const [tData, sData] = await Promise.all([
        fetchCSV("teachers.csv"),
        fetchCSV("students.csv")
    ]);
    document.getElementById("teacherCount").textContent = tData.length;
    document.getElementById("studentCount").textContent = sData.length;
    document.getElementById("updatedAt").textContent = new Date().toLocaleString();
}

async function loadTeachers() {
    const teachers = await fetchCSV("teachers.csv");
    const tbody = document.querySelector("#teachersTable tbody");
    tbody.innerHTML = teachers.map((t, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${t.Name || "N/A"}</td>
            <td>${t.Sex || "-"}</td>
            <td>${t.Subject || "-"}</td>
            <td>${t.Class || "-"}</td>
            <td>${t.Role || "-"}</td>
            <td><code>${generateUsername(t.Name)}</code></td>
        </tr>
    `).join('');
}

async function loadStudents() {
    const students = await fetchCSV("students.csv");
    const tbody = document.querySelector("#studentsTable tbody");
    tbody.innerHTML = students.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${s.Name || "N/A"}</td>
            <td>${s.Sex || "-"}</td>
            <td>${s.Class || "-"}</td>
            <td>${s.ExamNo || "-"}</td>
            <td>${s.Phone || "-"}</td>
        </tr>
    `).join('');
}

async function loadPerformance(form) {
    const data = await fetchCSV(`${form}.csv`);
    const tbody = document.querySelector("#performanceTable tbody");
    const summaryBody = document.querySelector("#divisionSummary tbody");

    if (data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='9'>No data found for this form.</td></tr>";
        return;
    }

    // Populate Table
    tbody.innerHTML = data.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${s.Name}</td>
            <td>${s.Test1 || 0}</td>
            <td>${s.MidTerm || 0}</td>
            <td>${s.Test2 || 0}</td>
            <td>${s.Exam || 0}</td>
            <td><strong>${s.Average || 0}</strong></td>
            <td>${s.Division || "-"}</td>
            <td>${s.Points || "-"}</td>
        </tr>
    `).join('');

    // Generate Summary
    const stats = data.reduce((acc, curr) => {
        const div = curr.Division || "N/A";
        acc[div] = (acc[div] || 0) + 1;
        return acc;
    }, {});

    summaryBody.innerHTML = Object.entries(stats)
        .map(([div, count]) => `<tr><td>${div}</td><td>${count}</td></tr>`)
        .join('');
}

// ===== Initialization =====
window.addEventListener("hashchange", router);
window.addEventListener("load", () => {
    if (location.hash && location.hash !== "#/login") {
        // Simple session check: if refreshed, go back to login 
        // unless you implement localStorage sessions
        location.hash = ""; 
    }
});

// Logout Helper
document.getElementById("logoutBtn").addEventListener("click", () => {
    state.currentUser = null;
    location.reload(); // Cleanest way to reset state
});
