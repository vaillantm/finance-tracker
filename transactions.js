// ==========================================
// HELPER FUNCTIONS FOR USER DATA
// ==========================================
const getCurrentUserEmail = () => {
    return localStorage.getItem('currentUserEmail') || '';
};

const getCurrentUser = () => {
    const email = getCurrentUserEmail();
    if (!email) return null;
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    return usersData[email] || null;
};

const saveUserData = (user) => {
    const email = getCurrentUserEmail();
    if (!email) return;
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    usersData[email] = user;
    localStorage.setItem('users', JSON.stringify(usersData));
};

// ==========================================
// SIDEBAR & HAMBURGER MENU
// ==========================================
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("overlay");

hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
});

// ==========================================
// MODAL CONTROLS
// ==========================================

// Add Transaction Modal
const openBtn = document.getElementById('open-transaction-btn');
const modal = document.getElementById('transaction-modal');
const closeX = document.getElementById('close-transaction-x');
const closeCancel = document.getElementById('close-transaction-cancel');

openBtn.addEventListener('click', () => modal.classList.add('show'));
closeX.addEventListener('click', () => modal.classList.remove('show'));
closeCancel.addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', e => { 
    if (e.target === modal) modal.classList.remove('show'); 
});

// Edit Transaction Modal
const editModal = document.getElementById('edit-modal');
const closeEditX = document.getElementById('close-edit-x');
const cancelEdit = document.getElementById('cancel-edit');
let editingIndex = -1;

closeEditX.addEventListener('click', () => editModal.classList.remove('show'));
cancelEdit.addEventListener('click', () => editModal.classList.remove('show'));
editModal.addEventListener('click', e => { 
    if (e.target === editModal) editModal.classList.remove('show'); 
});

// Delete Confirmation Modal
const deleteModal = document.getElementById('delete-modal');
const closeDeleteX = document.getElementById('close-delete-x');
const cancelDelete = document.getElementById('cancel-delete');
const confirmDelete = document.getElementById('confirm-delete');
let deleteIndex = -1;

closeDeleteX.addEventListener('click', () => deleteModal.classList.remove('show'));
cancelDelete.addEventListener('click', () => deleteModal.classList.remove('show'));
deleteModal.addEventListener('click', e => { 
    if (e.target === deleteModal) deleteModal.classList.remove('show'); 
});

confirmDelete.addEventListener('click', () => {
    if (deleteIndex >= 0) {
        const user = getCurrentUser();
        if (!user) return;
        user.transactions = user.transactions || [];
        user.transactions.splice(deleteIndex, 1);
        saveUserData(user);
        deleteModal.classList.remove('show');
        loadTransactions();
    }
});

// ==========================================
// ADD TRANSACTION FORM
// ==========================================
let transactionType = "Expense";

document.getElementById("expense-btn").addEventListener("click", () => {
    transactionType = "Expense";
    document.getElementById("expense-btn").classList.add("bg-white", "shadow-sm", "text-gray-900", "border", "border-gray-200");
    document.getElementById("income-btn").classList.remove("bg-white", "shadow-sm", "text-gray-900", "border", "border-gray-200");
});

document.getElementById("income-btn").addEventListener("click", () => {
    transactionType = "Income";
    document.getElementById("income-btn").classList.add("bg-white", "shadow-sm", "text-gray-900", "border", "border-gray-200");
    document.getElementById("expense-btn").classList.remove("bg-white", "shadow-sm", "text-gray-900", "border", "border-gray-200");
});

const form = document.getElementById("transaction-form");
form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById("amount").value).toFixed(2);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;

    if (!amount || !category || !date || !description) {
        return alert("Please fill all fields.");
    }

    const transaction = { 
        type: transactionType, 
        amount, 
        category, 
        date, 
        description 
    };

    // Save to localStorage
    const user = getCurrentUser();
    if (!user) {
        alert("Please log in to add transactions.");
        return;
    }
    user.transactions = user.transactions || [];
    user.transactions.push(transaction);
    saveUserData(user);

    // Reload transactions
    loadTransactions();

    modal.classList.remove("show");
    form.reset();
});

// ==========================================
// EDIT TRANSACTION FORM
// ==========================================
const editForm = document.getElementById("edit-form");
editForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const description = document.getElementById("edit-description").value;
    const amount = parseFloat(document.getElementById("edit-amount").value).toFixed(2);
    const category = document.getElementById("edit-category").value;
    const type = document.getElementById("edit-type").value;

    if (!description || !amount || !category || !type) {
        return alert("Please fill all fields.");
    }

    const user = getCurrentUser();
    if (!user) {
        alert("Please log in to edit transactions.");
        return;
    }
    user.transactions = user.transactions || [];
    if (editingIndex >= 0 && editingIndex < user.transactions.length) {
        user.transactions[editingIndex] = { 
            ...user.transactions[editingIndex],
            description, 
            amount, 
            category, 
            type 
        };
        saveUserData(user);
        loadTransactions();
        editModal.classList.remove("show");
    }
});

// ==========================================
// LOAD & DISPLAY TRANSACTIONS
// ==========================================
function loadTransactions() {
    const list = document.getElementById("transactions-list");
    list.innerHTML = "";
    const user = getCurrentUser();
    if (!user) return;
    const transactions = user.transactions || [];
    transactions.forEach((t, index) => appendTransaction(t, index));
    updateStats();
}

function appendTransaction(t, index) {
    const list = document.getElementById("transactions-list");
    const div = document.createElement("div");
    div.className = "flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0";
    div.innerHTML = `
        <div class="flex items-center space-x-4">
            <div class="w-2 h-2 rounded-full ${t.type === "Income" ? "bg-green-500" : "bg-red-500"} flex-shrink-0"></div>
            <div>
                <p class="font-medium text-gray-900">${t.description}</p>
                <div class="flex items-center text-xs text-gray-500 mt-0.5">
                    <span class="px-2 py-0.5 ${t.type === "Income" ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"} rounded font-medium mr-2">${t.category}</span>
                    <span>${t.date}</span>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-4">
            <span class="text-lg font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"} mr-4">${t.type === "Income" ? "+$" : "-$"}${t.amount}</span>
            <button class="edit-btn text-gray-400 hover:text-emerald-600 transition" data-index="${index}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <button class="delete-btn text-gray-400 hover:text-red-600 transition" data-index="${index}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    list.appendChild(div);
    
    // Add event listeners for edit and delete buttons
    div.querySelector('.edit-btn').addEventListener('click', () => openEditModal(index));
    div.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(index));
}

// ==========================================
// OPEN EDIT & DELETE MODALS
// ==========================================
function openEditModal(index) {
    const user = getCurrentUser();
    if (!user) return;
    const transactions = user.transactions || [];
    const t = transactions[index];
    
    document.getElementById("edit-description").value = t.description;
    document.getElementById("edit-amount").value = t.amount;
    document.getElementById("edit-category").value = t.category;
    document.getElementById("edit-type").value = t.type;
    
    editingIndex = index;
    editModal.classList.add("show");
}

function openDeleteModal(index) {
    deleteIndex = index;
    deleteModal.classList.add("show");
}

// ==========================================
// UPDATE STATISTICS
// ==========================================
function updateStats() {
    const user = getCurrentUser();
    if (!user) return;
    const transactions = user.transactions || [];
    let income = 0, expense = 0;
    
    transactions.forEach(t => { 
        if (t.type === "Income") {
            income += parseFloat(t.amount);
        } else {
            expense += parseFloat(t.amount);
        }
    });
    
    document.getElementById("total-income").textContent = `$${income.toFixed(2)}`;
    document.getElementById("total-expense").textContent = `$${expense.toFixed(2)}`;
    document.getElementById("net-balance").textContent = `$${(income - expense).toFixed(2)}`;
    document.getElementById("income-count").textContent = transactions.filter(t => t.type === "Income").length;
    document.getElementById("expense-count").textContent = transactions.filter(t => t.type === "Expense").length;
    document.getElementById("total-count").textContent = transactions.length + " total";
}

// ==========================================
// FILTERING LOGIC
// ==========================================
const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const categoryFilter = document.getElementById("category-filter");
const clearFilters = document.getElementById("clear-filters");

function applyFilters() {
    const user = getCurrentUser();
    if (!user) return;
    const transactions = user.transactions || [];
    const searchText = searchInput.value.toLowerCase();
    const typeValue = typeFilter.value;
    const categoryValue = categoryFilter.value;

    const filtered = transactions.map((t, index) => ({...t, originalIndex: index})).filter(t => {
        const matchesText = t.description.toLowerCase().includes(searchText);
        const matchesType = typeValue === "All Types" || t.type === typeValue;
        const matchesCategory = categoryValue === "All Categories" || t.category === categoryValue;
        return matchesText && matchesType && matchesCategory;
    });

    const list = document.getElementById("transactions-list");
    list.innerHTML = "";
    filtered.forEach(t => appendTransactionFiltered(t));
}

function appendTransactionFiltered(t) {
    const list = document.getElementById("transactions-list");
    const div = document.createElement("div");
    div.className = "flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0";
    div.innerHTML = `
        <div class="flex items-center space-x-4">
            <div class="w-2 h-2 rounded-full ${t.type === "Income" ? "bg-green-500" : "bg-red-500"} flex-shrink-0"></div>
            <div>
                <p class="font-medium text-gray-900">${t.description}</p>
                <div class="flex items-center text-xs text-gray-500 mt-0.5">
                    <span class="px-2 py-0.5 ${t.type === "Income" ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"} rounded font-medium mr-2">${t.category}</span>
                    <span>${t.date}</span>
                </div>
            </div>
        </div>
        <div class="flex items-center space-x-4">
            <span class="text-lg font-semibold ${t.type === "Income" ? "text-green-600" : "text-red-600"} mr-4">${t.type === "Income" ? "+$" : "-$"}${t.amount}</span>
            <button class="edit-btn text-gray-400 hover:text-emerald-600 transition" data-index="${t.originalIndex}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <button class="delete-btn text-gray-400 hover:text-red-600 transition" data-index="${t.originalIndex}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    list.appendChild(div);
    
    div.querySelector('.edit-btn').addEventListener('click', () => openEditModal(t.originalIndex));
    div.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(t.originalIndex));
}

// Event listeners for filtering
searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

clearFilters.addEventListener("click", () => {
    searchInput.value = "";
    typeFilter.value = "All Types";
    categoryFilter.value = "All Categories";
    loadTransactions();
});

// ==========================================
// EXPORT CSV
// ==========================================
document.getElementById("export-csv-btn").addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) {
        alert("Please log in to export transactions.");
        return;
    }
    const transactions = user.transactions || [];
    
    if (!transactions.length) {
        return alert("No transactions to export.");
    }

    let csv = "Type,Amount,Category,Date,Description\n";
    transactions.forEach(t => {
        csv += `${t.type},${t.amount},${t.category},${t.date},"${t.description}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
});

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Display user info in header
    const user = getCurrentUser();
    if (user) {
        const nameElem = document.getElementById('header-name');
        const emailElem = document.getElementById('header-email');
        if (nameElem) nameElem.textContent = user.name || 'User';
        if (emailElem) emailElem.textContent = getCurrentUserEmail();
    }
    
    loadTransactions();
});