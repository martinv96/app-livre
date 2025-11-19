const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let userId = localStorage.getItem('userId');

function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `message `;
    message.textContent = text;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
}

let confirmCallback = null;

function showConfirm(message) {
    return new Promise((resolve) => {
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').style.display = 'block';
        confirmCallback = resolve;
    });
}

function confirmAction(result) {
    document.getElementById('confirmModal').style.display = 'none';
    if (confirmCallback) {
        confirmCallback(result);
        confirmCallback = null;
    }
}

async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { ok: response.ok, data };
    } catch (error) {
        return { ok: false, error: error.message };
    }
}

function showSection(sectionId) {
    ['authSection', 'catalogSection', 'profileSection', 'adminSection'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function updateNav() {
    const navLinks = document.getElementById('navLinks');
    if (token) {
        navLinks.innerHTML = `
            <button onclick="showCatalog()">Catalogue</button>
            <button onclick="showProfile()">Mon Profil</button>
            <button onclick="showAdmin()">Admin</button>
            <button onclick="logout()">Déconnexion</button>
        `;
        showCatalog();
    } else {
        navLinks.innerHTML = '';
        showSection('authSection');
    }
}

function logout() {
    token = null;
    userId = null;
    localStorage.clear();
    updateNav();
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await apiCall(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value
        })
    });
    if (result.ok) {
        showMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        document.getElementById('registerForm').reset();
    } else {
        showMessage(result.data.message, 'error');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await apiCall(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        })
    });
    if (result.ok) {
        token = result.data.token;
        userId = result.data.userId;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        updateNav();
    } else {
        showMessage(result.data.message, 'error');
    }
});

function showCatalog() {
    showSection('catalogSection');
    loadBooks();
}

async function loadBooks() {
    const result = await apiCall(`${API_URL}/books`);
    if (result.ok) displayBooks(result.data);
    else showMessage('Erreur lors du chargement', 'error');
}

async function searchBooks() {
    const params = new URLSearchParams();
    const filters = {
        titre: document.getElementById('searchTitle').value,
        auteur: document.getElementById('searchAuthor').value,
        categorie: document.getElementById('searchCategory').value
    };
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });
    const result = await apiCall(`${API_URL}/books?${params}`);
    if (result.ok) displayBooks(result.data);
    else showMessage('Erreur lors de la recherche', 'error');
}

function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    if (books.length === 0) {
        booksList.innerHTML = '<p>Aucun livre trouvé</p>';
        return;
    }
    booksList.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${book.titre}</h3>
            <p><strong>Auteur:</strong> ${book.auteur}</p>
            <p><strong>Catégorie:</strong> ${book.categorie}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p>${book.resume || ''}</p>
            <p class="${book.disponibilite ? 'disponible' : 'indisponible'}">
                ${book.disponibilite ? '✓ Disponible' : '✗ Non disponible'}
            </p>
            ${book.disponibilite && token ? `<button class="btn-success" onclick="borrowBook('${book._id}')">Emprunter</button>` : ''}
        </div>
    `).join('');
}

async function borrowBook(bookId) {
    const result = await apiCall(`${API_URL}/loans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, bookId })
    });
    if (result.ok) {
        showMessage('Livre emprunté avec succès !');
        loadBooks();
    } else {
        showMessage(result.data.message, 'error');
    }
}

function showProfile() {
    showSection('profileSection');
    loadLoanHistory();
}

async function loadLoanHistory() {
    const result = await apiCall(`${API_URL}/loans/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const loanHistory = document.getElementById('loanHistory');
    if (!result.ok || result.data.length === 0) {
        loanHistory.innerHTML = '<p>Aucun emprunt</p>';
        return;
    }
    loanHistory.innerHTML = result.data.map(loan => `
        <div class="loan-card">
            <h3>${loan.bookId ? loan.bookId.titre : 'Livre supprimé'}</h3>
            <p><strong>Auteur:</strong> ${loan.bookId ? loan.bookId.auteur : 'N/A'}</p>
            <p><strong>Date d'emprunt:</strong> ${new Date(loan.dateEmprunt).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> ${loan.status}</p>
        </div>
    `).join('');
}

function showAdmin() {
    showSection('adminSection');
    loadAdminBooks();
}

document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await apiCall(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            titre: document.getElementById('bookTitle').value,
            auteur: document.getElementById('bookAuthor').value,
            categorie: document.getElementById('bookCategory').value,
            isbn: document.getElementById('bookISBN').value,
            resume: document.getElementById('bookResume').value
        })
    });
    if (result.ok) {
        showMessage('Livre ajouté avec succès !');
        document.getElementById('addBookForm').reset();
        loadAdminBooks();
    } else {
        showMessage(result.data.message, 'error');
    }
});

async function loadAdminBooks() {
    const result = await apiCall(`${API_URL}/books`);
    if (!result.ok) {
        showMessage('Erreur lors du chargement', 'error');
        return;
    }
    document.getElementById('adminBooksList').innerHTML = result.data.map(book => `
        <div class="book-card">
            <h3>${book.titre}</h3>
            <p><strong>Auteur:</strong> ${book.auteur}</p>
            <p><strong>Catégorie:</strong> ${book.categorie}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p>${book.resume || ''}</p>
            <p class="${book.disponibilite ? 'disponible' : 'indisponible'}">
                ${book.disponibilite ? '✓ Disponible' : '✗ Non disponible'}
            </p>
            <div class="book-actions">
                <button class="btn-danger" onclick="deleteBook('${book._id}')">Supprimer</button>
            </div>
        </div>
    `).join('');
}

async function deleteBook(bookId) {
    const confirmed = await showConfirm('Voulez-vous vraiment supprimer ce livre ?');
    if (!confirmed) return;
    const result = await apiCall(`${API_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (result.ok) {
        showMessage('Livre supprimé avec succès !');
        loadAdminBooks();
    } else {
        showMessage('Erreur lors de la suppression', 'error');
    }
}

updateNav();
