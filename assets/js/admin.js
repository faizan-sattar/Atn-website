// Admin Dashboard JavaScript

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    } else {
        showLogin();
    }
});

// Login Function
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (In production, use proper backend authentication)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        showAlert('loginAlert', 'Login successful!', 'success');
    } else {
        showAlert('loginAlert', 'Invalid credentials!', 'error');
    }
});

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAllData();
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    showLogin();
}

function showAlert(elementId, message, type) {
    const alertDiv = document.getElementById(elementId);
    alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 3000);
}

// Tab Switching
function switchTab(tab) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(tab + 'Section').classList.add('active');
    event.target.classList.add('active');
}

// Initialize Data Storage
function initStorage() {
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify([]));
    }
    if (!localStorage.getItem('team')) {
        localStorage.setItem('team', JSON.stringify([]));
    }
    if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify([]));
    }
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify([]));
    }
}

// Load All Data
function loadAllData() {
    initStorage();
    loadProjects();
    loadTeam();
    loadServices();
    loadMessages();
    updateStats();
}

// Update Stats
function updateStats() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const team = JSON.parse(localStorage.getItem('team') || '[]');
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');

    document.getElementById('statsProjects').textContent = projects.length;
    document.getElementById('statsTeam').textContent = team.length;
    document.getElementById('statsServices').textContent = services.length;
    document.getElementById('statsMessages').textContent = messages.length;
}

// ============================================
// PROJECTS MANAGEMENT
// ============================================

function addProject() {
    const name = document.getElementById('projectName').value;
    const desc = document.getElementById('projectDesc').value;
    const image = document.getElementById('projectImage').value;
    const tech = document.getElementById('projectTech').value;
    const category = document.getElementById('projectCategory').value;

    if (!name || !desc) {
        alert('Please fill in required fields');
        return;
    }

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const newProject = {
        id: Date.now(),
        name,
        desc,
        image: image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
        tech: tech.split(',').map(t => t.trim()),
        category
    };

    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));

    // Clear form
    document.getElementById('projectName').value = '';
    document.getElementById('projectDesc').value = '';
    document.getElementById('projectImage').value = '';
    document.getElementById('projectTech').value = '';

    loadProjects();
    updateStats();
}

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const container = document.getElementById('projectsList');

    if (projects.length === 0) {
        container.innerHTML = '<p style="color: #b0b0b0;">No projects yet. Add your first project!</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="admin-card">
            <img src="${project.image}" alt="${project.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; margin-bottom: 1rem;">
            <h3>${project.name}</h3>
            <p>${project.desc}</p>
            <p style="color: #10b981; font-size: 0.875rem;">
                ${project.tech.join(', ')}
            </p>
            <div class="admin-actions">
                <button class="btn-delete" onclick="deleteProject(${project.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));

    loadProjects();
    updateStats();
}

// ============================================
// TEAM MANAGEMENT
// ============================================

function addTeamMember() {
    const name = document.getElementById('teamName').value;
    const role = document.getElementById('teamRole').value;
    const image = document.getElementById('teamImage').value;
    const skills = document.getElementById('teamSkills').value;

    if (!name || !role) {
        alert('Please fill in required fields');
        return;
    }

    const team = JSON.parse(localStorage.getItem('team') || '[]');
    const newMember = {
        id: Date.now(),
        name,
        role,
        image: image || 'assets/images/team/default.jpg',
        skills: skills.split(',').map(s => s.trim())
    };

    team.push(newMember);
    localStorage.setItem('team', JSON.stringify(team));

    // Clear form
    document.getElementById('teamName').value = '';
    document.getElementById('teamRole').value = '';
    document.getElementById('teamImage').value = '';
    document.getElementById('teamSkills').value = '';

    loadTeam();
    updateStats();
}

function loadTeam() {
    const team = JSON.parse(localStorage.getItem('team') || '[]');
    const container = document.getElementById('teamList');

    if (team.length === 0) {
        container.innerHTML = '<p style="color: #b0b0b0;">No team members yet. Add your first team member!</p>';
        return;
    }

    container.innerHTML = team.map(member => `
        <div class="admin-card">
            <img src="${member.image}" alt="${member.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin-bottom: 1rem;">
            <h3>${member.name}</h3>
            <p style="color: #10b981;">${member.role}</p>
            <p style="font-size: 0.875rem;">
                ${member.skills.join(', ')}
            </p>
            <div class="admin-actions">
                <button class="btn-delete" onclick="deleteTeamMember(${member.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteTeamMember(id) {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    let team = JSON.parse(localStorage.getItem('team') || '[]');
    team = team.filter(m => m.id !== id);
    localStorage.setItem('team', JSON.stringify(team));

    loadTeam();
    updateStats();
}

// ============================================
// SERVICES MANAGEMENT
// ============================================

function addService() {
    const name = document.getElementById('serviceName').value;
    const desc = document.getElementById('serviceDesc').value;
    const icon = document.getElementById('serviceIcon').value;

    if (!name || !desc) {
        alert('Please fill in required fields');
        return;
    }

    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const newService = {
        id: Date.now(),
        name,
        desc,
        icon: icon || '💼'
    };

    services.push(newService);
    localStorage.setItem('services', JSON.stringify(services));

    // Clear form
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDesc').value = '';
    document.getElementById('serviceIcon').value = '';

    loadServices();
    updateStats();
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    const container = document.getElementById('servicesList');

    if (services.length === 0) {
        container.innerHTML = '<p style="color: #b0b0b0;">No services yet. Add your first service!</p>';
        return;
    }

    container.innerHTML = services.map(service => `
        <div class="admin-card">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${service.icon}</div>
            <h3>${service.name}</h3>
            <p>${service.desc}</p>
            <div class="admin-actions">
                <button class="btn-delete" onclick="deleteService(${service.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    let services = JSON.parse(localStorage.getItem('services') || '[]');
    services = services.filter(s => s.id !== id);
    localStorage.setItem('services', JSON.stringify(services));

    loadServices();
    updateStats();
}

// ============================================
// MESSAGES MANAGEMENT
// ============================================

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const container = document.getElementById('messagesList');

    if (messages.length === 0) {
        container.innerHTML = '<p style="color: #b0b0b0;">No messages yet.</p>';
        return;
    }

    container.innerHTML = messages.map(msg => `
        <div class="admin-card">
            <h3>${msg.name}</h3>
            <p style="color: #10b981; font-size: 0.875rem;">${msg.email}</p>
            <p style="color: #b0b0b0; font-size: 0.875rem; margin-bottom: 0.5rem;">${msg.phone || 'No phone'}</p>
            <p>${msg.message}</p>
            <p style="color: #666; font-size: 0.75rem; margin-top: 0.5rem;">
                ${new Date(msg.date).toLocaleString()}
            </p>
            <div class="admin-actions">
                <button class="btn-delete" onclick="deleteMessage(${msg.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem('messages', JSON.stringify(messages));

    loadMessages();
    updateStats();
}

// Export data function (for backup)
function exportData() {
    const data = {
        projects: JSON.parse(localStorage.getItem('projects') || '[]'),
        team: JSON.parse(localStorage.getItem('team') || '[]'),
        services: JSON.parse(localStorage.getItem('services') || '[]'),
        messages: JSON.parse(localStorage.getItem('messages') || '[]')
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'atn-backup-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
}
