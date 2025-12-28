import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadDashboard() {
    try {
        // Fetch all necessary data simultaneously
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

        // Update UI Population
        document.getElementById('totalS').innerText = sM + sF;
        document.getElementById('genderS').innerText = `Male: ${sM} | Female: ${sF}`;
        document.getElementById('totalT').innerText = tM + tF;
        document.getElementById('genderT').innerText = `Male: ${tM} | Female: ${tF}`;

        // 2. ACADEMIC ANALYSIS
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

            // Map grades to points
            let points = student.grades.map(g => {
                const grade = g.toUpperCase();
                if (grade === 'A') return 1;
                if (grade === 'B') return 2;
                if (grade === 'C') return 3;
                if (grade === 'D') return 4;
                return 5; // F
            }).sort((a, b) => a - b);

            // NECTA Best 7 points
            const totalPoints = points.slice(0, 7).reduce((a, b) => a + b, 0);

            let div = "0";
            if (totalPoints >= 7 && totalPoints <= 17) div = "I";
            else if (totalPoints <= 21) div = "II";
            else if (totalPoints <= 25) div = "III";
            else if (totalPoints <= 33) div = "IV";
            else div = "0";

            if (classes[student.cls]) classes[student.cls][div]++;
        });

        // 3. RENDER GRID
        const grid = document.getElementById('passGrid');
        grid.innerHTML = "";
        Object.entries(classes).forEach(([className, d]) => {
            grid.innerHTML += `
                <div class="class-card">
                    <h3>${className}</h3>
                    <div class="div-row"><span>Division I</span> <b>${d.I}</b></div>
                    <div class="div-row"><span>Division II</span> <b>${d.II}</b></div>
                    <div class="div-row"><span>Division III</span> <b>${d.III}</b></div>
                    <div class="div-row"><span>Division IV</span> <b>${d.IV}</b></div>
                    <div class="div-row"><span>Division 0</span> <b>${d['0']}</b></div>
                </div>`;
        });

    } catch (err) {
        console.error("Error loading dashboard:", err);
        document.getElementById('passGrid').innerHTML = "<p>Error loading data. Check console.</p>";
    }
}

loadDashboard();
