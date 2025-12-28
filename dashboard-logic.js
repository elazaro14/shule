import { db, auth } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

async function loadData() {
    try {
        const [studSnap, resSnap, userSnap] = await Promise.all([
            getDocs(collection(db, "students")),
            getDocs(collection(db, "results")),
            getDocs(collection(db, "users"))
        ]);

        // 1. POPULATION LOGIC
        let sM = 0, sF = 0, tM = 0, tF = 0;
        const studentMap = {};

        studSnap.forEach(doc => {
            const s = doc.data();
            if (s.gender === "M") sM++; else if (s.gender === "F") sF++;
            studentMap[doc.id] = { cls: s.cls, grades: [] };
        });

        userSnap.forEach(doc => {
            const u = doc.data();
            if (u.role === "teacher" || u.role === "admin") {
                if (u.gender === "M") tM++; else if (u.gender === "F") tF++;
            }
        });

        document.getElementById('totalS').innerText = sM + sF;
        document.getElementById('detailS').innerText = `Male: ${sM} | Female: ${sF}`;
        document.getElementById('totalT').innerText = tM + tF;
        document.getElementById('detailT').innerText = `Male: ${tM} | Female: ${tF}`;

        // 2. DIVISION LOGIC (A=1, B=2, C=3, D=4, F=5)
        resSnap.forEach(doc => {
            const r = doc.data();
            if (studentMap[r.studentId]) studentMap[r.studentId].grades.push(r.grade);
        });

        const classes = {
            "Form 1": {I:0, II:0, III:0, IV:0, 0:0},
            "Form 2": {I:0, II:0, III:0, IV:0, 0:0},
            "Form 3": {I:0, II:0, III:0, IV:0, 0:0},
            "Form 4": {I:0, II:0, III:0, IV:0, 0:0}
        };

        Object.values(studentMap).forEach(student => {
            if (student.grades.length === 0) return;

            let pts = student.grades.map(g => {
                let grade = g.toUpperCase();
                return grade==='A'?1 : grade==='B'?2 : grade==='C'?3 : grade==='D'?4 : 5;
            }).sort((a, b) => a - b);

            const best7Sum = pts.slice(0, 7).reduce((a, b) => a + b, 0);

            let div = "0";
            if (best7Sum >= 7 && best7Sum <= 17) div = "I";
            else if (best7Sum <= 21) div = "II";
            else if (best7Sum <= 25) div = "III";
            else if (best7Sum <= 33) div = "IV";

            if (classes[student.cls]) classes[student.cls][div]++;
        });

        const grid = document.getElementById('passGrid');
        grid.innerHTML = "";
        Object.entries(classes).forEach(([clsName, d]) => {
            grid.innerHTML += `
                <div class="class-card">
                    <h3>${clsName}</h3>
                    <div class="div-row"><span>Division I</span><b>${d.I}</b></div>
                    <div class="div-row"><span>Division II</span><b>${d.II}</b></div>
                    <div class="div-row"><span>Division III</span><b>${d.III}</b></div>
                    <div class="div-row"><span>Division IV</span><b>${d.IV}</b></div>
                    <div class="div-row"><span>Division 0</span><b>${d['0']}</b></div>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

window.logout = () => {
    signOut(auth).then(() => window.location.href = "index.html");
};

loadData();
