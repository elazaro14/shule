// Theme toggle and active nav
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleTheme');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      document.body.classList.toggle('light', next === 'light');
    });
  }
  markActiveNav();
  router();
});

// Mark active nav by hash
function markActiveNav() {
  const nav = document.querySelectorAll('.nav a');
  const here = location.hash || '#/dashboard';
  nav.forEach(a => a.classList.remove('active'));
  const activeLink = Array.from(nav).find(a => a.getAttribute('href') === here);
  if (activeLink) activeLink.classList.add('active');
}

// Simple hash router
window.addEventListener('hashchange', () => {
  markActiveNav();
  router();
});

function router() {
  const route = location.hash || '#/dashboard';
  const views = document.querySelectorAll('.view');
  views.forEach(v => v.classList.add('hide'));
  const map = {
    '#/dashboard': 'view-dashboard',
    '#/teachers': 'view-teachers',
    '#/students': 'view-students',
    '#/performance': 'view-performance',
    '#/attendance': 'view-attendance',
    '#/print': 'view-print',
  };
  const id = map[route] || 'view-dashboard';
  document.getElementById(id).classList.remove('hide');

  // Load per-view data on first show
  if (route === '#/dashboard') loadCounts();
  if (route === '#/teachers') loadTeachers();
  if (route === '#/students') loadStudents();
  if (route === '#/performance') {
    initPerformance();
  }
  if (route === '#/attendance') loadAttendance();
  if (route === '#/print') initPrint();
}

// CSV utils
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] ?? '');
    return obj;
  });
}

async function fetchCSV(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const text = await res.text();
  return parseCSV(text);
}

function summarizeDivisions(rows) {
  const summary = { I:0, II:0, III:0, IV:0, '0':0, F:0, M:0, TOTAL:rows.length };
  rows.forEach(s => {
    const div = (s.Division || '').toUpperCase();
    if (summary.hasOwnProperty(div)) summary[div]++;
  });
  return summary;
}

// Dashboard counts
async function loadCounts() {
  try {
    const [teachers, students] = await Promise.all([
      fetchCSV('data/teachers.csv'),
      fetchCSV('data/students.csv')
    ]);
    document.getElementById('teacherCount').textContent = String(teachers.length);
    document.getElementById('studentCount').textContent = String(students.length);
    document.getElementById('updatedAt').textContent = new Date().toLocaleString();
  } catch (e) {
    console.warn('Counts failed:', e.message);
  }
}

// Teachers
async function loadTeachers() {
  try {
    const rows = await fetchCSV('data/teachers.csv');
    const tbody = document.querySelector('#teachersTable tbody');
    tbody.innerHTML = '';
    rows.forEach((t, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${t.Name || ''}</td>
        <td>${t.Sex || ''}</td>
        <td>${t.Subject || ''}</td>
        <td>${t.Class || ''}</td>
        <td>${t.Role || ''}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.warn('loadTeachers:', e.message);
  }
}

// Students
async function loadStudents() {
  try {
    const rows = await fetchCSV('data/students.csv');
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';
    rows.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${s.Name || ''}</td>
        <td>${s.Sex || ''}</td>
        <td>${s.Class || ''}</td>
        <td>${s.ExamNo || ''}</td>
        <td>${s.Phone || ''}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.warn('loadStudents:', e.message);
  }
}

// Performance
function initPerformance() {
  const formSelect = document.getElementById('formSelect');
  const reloadPerf = document.getElementById('reloadPerf');
  const printPerfBtn = document.getElementById('printPerfBtn');

  if (!reloadPerf.dataset.bound) {
    reloadPerf.addEventListener('click', () => loadPerformance(formSelect.value));
    reloadPerf.dataset.bound = '1';
  }
  if (!printPerfBtn.dataset.bound) {
    printPerfBtn.addEventListener('click', () => window.print());
    printPerfBtn.dataset.bound = '1';
  }
  loadPerformance(formSelect.value);
}

async function loadPerformance(form) {
  try {
    const rows = await fetchCSV(`data/${form}.csv`);
    const tbody = document.querySelector('#performanceTable tbody');
    const divBody = document.querySelector('#divisionSummary tbody');
    tbody.innerHTML = '';
    divBody.innerHTML = '';

    rows.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${s.Name || ''}</td>
        <td>${s.Test1 || ''}</td>
        <td>${s.MidTerm || ''}</td>
        <td>${s.Test2 || ''}</td>
        <td>${s.Exam || ''}</td>
        <td>${s.Average || ''}</td>
        <td>${s.Division || ''}</td>
        <td>${s.Points || ''}</td>
      `;
      tbody.appendChild(tr);
    });

    const summary = summarizeDivisions(rows);
    Object.entries(summary).forEach(([k, v]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
      divBody.appendChild(tr);
    });
  } catch (e) {
    console.warn('loadPerformance:', e.message);
  }
}

// Attendance
async function loadAttendance() {
  try {
    const students = await fetchCSV('data/students.csv');
    const tbody = document.querySelector('#attendanceTable tbody');
    tbody.innerHTML = '';
    students.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.Name || ''}</td>
        <td>
          <select class="input">
            <option>Present</option>
            <option>Absent</option>
          </select>
        </td>
        <td><button class="btn btn-secondary">Save</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.warn('loadAttendance:', e.message);
  }
}

// Print (RIPOTI)
function initPrint() {
  const printForm = document.getElementById('printForm');
  const printStudent = document.getElementById('printStudent');
  const printBtn = document.getElementById('printBtn');

  if (!printForm.dataset.bound) {
    printForm.addEventListener('change', () => populatePrintStudents());
    printForm.dataset.bound = '1';
  }
  if (!printBtn.dataset.bound) {
    printBtn.addEventListener('click', () => printSelectedReport());
    printBtn.dataset.bound = '1';
  }
  populatePrintStudents();
}

async function populatePrintStudents() {
  const form = document.getElementById('printForm').value;
  const perfRows = await fetchCSV(`data/${form}.csv`);
  const sel = document.getElementById('printStudent');
  sel.innerHTML = '';
  perfRows.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.ExamNo || r.Name;
    opt.textContent = r.Name;
    sel.appendChild(opt);
  });
}

async function fetchRipotiForForm(form) {
  const tryPaths = [`data/RIPOTI_${form}.csv`, `data/RIPOTI.csv`];
  for (const path of tryPaths) {
    try {
      const rows = await fetchCSV(path);
      const filtered = rows.filter(r => {
        const f = (r.Form || '').toUpperCase();
        return !r.Form || f === form.toUpperCase();
      });
      if (filtered.length) return filtered;
      if (rows.length) return rows;
    } catch (_) {}
  }
  throw new Error(`RIPOTI data not found for ${form}`);
}

function findRipotiRecord(rows, key) {
  return rows.find(r => (r.ExamNo || '').trim() === key.trim()) 
      || rows.find(r => (r.Name || '').trim().toLowerCase() === key.trim().toLowerCase());
}

async function printSelectedReport() {
  const form = document.getElementById('printForm').value;
  const key = document.getElementById('printStudent').value;
  const printArea = document.getElementById('printArea');

  if (!key) return alert('Please select a student.');

  const perfRows = await fetchCSV(`data/${form}.csv`);
  let ripotiRows = [];
  try { ripotiRows = await fetchRipotiForForm(form); } catch (e) { ripotiRows = []; }

  const perf = perfRows.find(r => (r.ExamNo || r.Name) === key);
  const ripoti = findRipotiRecord(ripotiRows, key);

  if (!perf && !ripoti) return alert('Student record not found in performance or RIPOTI.');

  const name = (ripoti?.Name || perf?.Name || '');
  const examNo = (ripoti?.ExamNo || perf?.ExamNo || '');
  const division = (ripoti?.Division || perf?.Division || '');
  const average = (ripoti?.Average || perf?.Average || '');
  const totalPoints = (ripoti?.TotalPoints || perf?.Points || '');
  const position = (ripoti?.Position || '');
  const outOf = (ripoti?.OutOf || '');
  const termCloseDate = (ripoti?.TermCloseDate || '');
  const nextOpeningDate = (ripoti?.NextOpeningDate || '');

  const behavior = {
    'Work performance': ripoti?.WorkPerformanceGrade || '',
    'Nation-building activities': ripoti?.NationBuildingGrade || '',
    'Leadership ability': ripoti?.LeadershipGrade || '',
    'Effort and knowledge': ripoti?.EffortAndKnowledgeGrade || '',
    'Obedience': ripoti?.ObedienceGrade || '',
    'Integrity of public property': ripoti?.IntegrityGrade || '',
    'Cleanliness': ripoti?.CleanlinessGrade || '',
    'Cooperation': ripoti?.CooperationGrade || '',
    'Honesty': ripoti?.HonestyGrade || '',
    'Respect': ripoti?.RespectGrade || '',
    'Culture and sports': ripoti?.CultureAndSportsGrade || '',
  };

  printArea.innerHTML = `
    <div>
      <h3 style="margin-top:0;">STUDENT PROGRESS REPORT</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Form:</b> ${form}</p>
      <p><b>Exam No.:</b> ${examNo}</p>
      <p><b>Position:</b> ${position}${outOf ? ` / ${outOf}` : ''}</p>
      <hr />
      <table class="table">
        <thead><tr><th>Assessment</th><th>Score</th></tr></thead>
        <tbody>
          <tr><td>Test 1</td><td>${perf?.Test1 || ''}</td></tr>
          <tr><td>Mid Term</td><td>${perf?.MidTerm || ''}</td></tr>
          <tr><td>Test 2</td><td>${perf?.Test2 || ''}</td></tr>
          <tr><td>Exam</td><td>${perf?.Exam || ''}</td></tr>
          <tr><td>Average</td><td>${average}</td></tr>
          <tr><td>Division</td><td>${division}</td></tr>
          <tr><td>Total points</td><td>${totalPoints}</td></tr>
        </tbody>
      </table>

      ${Object.values(behavior).some(v => v) ? `
      <h4>Behavior / Work conduct</h4>
      <table class="table">
        <thead><tr><th>Item</th><th>Grade</th></tr></thead>
        <tbody>
          ${Object.entries(behavior).map(([k,v]) => `<tr><td>${k}</td><td>${v || '-'}</td></tr>`).join('')}
        </tbody>
      </table>
      ` : ''}

      ${termCloseDate || nextOpeningDate ? `
      <h4>Term dates</h4>
      <p><b>Closed:</b> ${termCloseDate || ''}</p>
      <p><b>Reopening:</b> ${nextOpeningDate || ''}</p>
      ` : ''}

      <p class="hint">Grades: F = 0–29, D = 30–44, C = 45–64, B = 65–74, A = 75–100.</p>
    </div>
  `;
  window.print();
}
