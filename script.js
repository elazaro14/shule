const LS_KEY = "olmoti_v3_data";
let db = JSON.parse(localStorage.getItem(LS_KEY)) || { teachers: [], students: [] };

// LOGIN
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("username").value.trim();
    const p = document.getElementById("password").value.trim();
    const r = document.getElementById("role").value;

    if (r === "admin" && u === "elazaro14" && p === "503812el") {
        activeUser = { role: "admin" }; initApp();
    } else {
        const t = db.teachers.find(x => x.username === u && x.password === p);
        if (t) { activeUser = { role: "teacher", ...t }; initApp(); }
        else alert("Login Failed! Check Username/Password.");
    }
});

function initApp() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "flex";
    document.getElementById("adminMenu").style.display = activeUser.role === "admin" ? "block" : "none";
    document.getElementById("reportMenu").style.display = activeUser.role === "admin" ? "block" : "none";
    saveAndRefresh();
}

// TEACHER SORTING & REPORTING
function renderAdminReportTable() {
    const cls = document.getElementById("reportClassFilter").value;
    const tbody = document.querySelector("#adminReportTable tbody");
    tbody.innerHTML = "";
    if (!cls) return;

    let students = db.students.filter(s => s.sclass === cls);
    // Female First, then Male, then Name A-Z
    students.sort((a, b) => {
        if (a.sex !== b.sex) return a.sex === "Female" ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    tbody.innerHTML = students.map((s, i) => `
        <tr><td>${i+1}</td><td>${s.name}</td><td>${s.sex}</td>
        <td><button class="btn-primary" onclick="generateReportCard('${s.name}')">Generate Card</button></td></tr>`).join("");
}

// REPORT CARD HTML GENERATOR
function generateReportCard(name) {
    const s = db.students.find(x => x.name === name);
    const win = window.open('', '_blank');
    win.document.write(`<html><body style="font-family:sans-serif; text-align:center;">
        <h2>OLMOTI SECONDARY SCHOOL</h2>
        <p>REPORT CARD: ${s.name} (${s.sex}) - ${s.sclass}</p>
        <table border="1" style="width:100%; border-collapse:collapse;">
            <tr><th>Subject</th><th>Test</th><th>Exam</th><th>Total</th><th>Grade</th></tr>
            ${Object.keys(s.performance || {}).map(k => {
                const p = s.performance[k];
                const tot = (parseFloat(p.test)||0) + (parseFloat(p.exam)||0);
                return `<tr><td>${k.toUpperCase()}</td><td>${p.test}</td><td>${p.exam}</td><td>${tot}</td><td>-</td></tr>`;
            }).join("")}
        </table>
    </body></html>`);
    win.document.close();
    win.print();
}

// CRUD
document.getElementById("teacherForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("teacherName").value;
    const user = name.toLowerCase().split(" ")[0] + Math.floor(Math.random()*100);
    db.teachers.push({
        name, 
        sex: document.getElementById("teacherSex").value,
        assignedClass: document.getElementById("teacherClass").value,
        subjects: [document.getElementById("teacherSubjects").value],
        username: user,
        password: "Olmotiss"
    });
    saveAndRefresh(); e.target.reset();
});

document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    db.students.push({
        name: document.getElementById("studentName").value,
        sex: document.getElementById("studentSex").value,
        sclass: document.getElementById("studentClass").value,
        performance: {}
    });
    saveAndRefresh(); e.target.reset();
});

function saveAndRefresh() {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
    document.getElementById("totalTeachers").textContent = db.teachers.length;
    document.getElementById("totalStudents").textContent = db.students.length;
    
    const tb = document.querySelector("#teacherTable tbody");
    tb.innerHTML = db.teachers.map((t, i) => `<tr><td>${t.name}</td><td>${t.username}</td><td>${t.password}</td>
    <td><button onclick="deleteItem('teachers', ${i})">X</button></td></tr>`).join("");

    const sb = document.querySelector("#studentTable tbody");
    sb.innerHTML = db.students.map((s, i) => `<tr><td>${s.name}</td><td>${s.sex}</td><td>${s.sclass}</td>
    <td><button onclick="deleteItem('students', ${i})">X</button></td></tr>`).join("");
}

function deleteItem(type, i) { if(confirm("Delete?")) { db[type].splice(i,1); saveAndRefresh(); } }
function showPanel(p) { document.querySelectorAll(".panel").forEach(x => x.style.display="none"); document.getElementById(p).style.display="block"; }
function logout() { location.reload(); }
