let users = JSON.parse(localStorage.getItem('users')) || [];

// Initialize default admin if no users exist
if (users.length === 0) {
    users.push({ id: Date.now(), username: 'elazaro14', password: '503812el', role: 'admin' });
    localStorage.setItem('users', JSON.stringify(users));
}

// Current logged-in user (stored in sessionStorage for session persistence)
let currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;

// ... (keep existing login, logout, renderDashboard functions)

// Updated registerTeacher function with auto-generated username
function registerTeacher() {
    if (currentUser.role !== 'admin') return alert('Access denied');
    
    const firstName = document.getElementById('firstName').value.trim().toLowerCase();
    const lastName = document.getElementById('lastName').value.trim().toLowerCase();
    if (!firstName || !lastName) return alert('First and last name required');
    
    let baseUsername = `${firstName}.${lastName}`;
    let username = baseUsername;
    let counter = 1;
    while (users.find(u => u.username === username)) {
        username = `${baseUsername}${counter}`;
        counter++;
    }
    
    const teacher = {
        id: Date.now(),
        username,
        password: document.getElementById('t_password').value,
        role: 'teacher',
        subjects: document.getElementById('subjects').value.split(',').map(s => s.trim()),
        classToTeach: document.getElementById('classToTeach').value,
        isClassTeacher: document.getElementById('isClassTeacher').checked,
        classTeacherFor: document.getElementById('isClassTeacher').checked ? document.getElementById('classTeacherFor').value : '',
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1), // Store capitalized for display
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1)
    };
    users.push(teacher);
    localStorage.setItem('users', JSON.stringify(users));
    alert(`Teacher registered with username: ${username}`);
    // Clear form or refresh lists
}

// Keep registerStudent as is, or add similar name fields if needed
