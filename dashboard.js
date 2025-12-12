// ---------- Helper Functions ---------- //

// Format number as currency
const formatCurrency = (num) => {
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Get current user email
const getCurrentUserEmail = () => {
    return localStorage.getItem('currentUserEmail') || '';
};

// Get current user data
const getCurrentUser = () => {
    const email = getCurrentUserEmail();
    if (!email) return null;
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    // Assuming 'usersData' is an object where keys are emails and values are user objects.
    return usersData[email] || null;
};

// Get transactions from localStorage for the current user
const getTransactions = () => {
    const user = getCurrentUser();
    // Transactions should be stored in the user object
    if (!user) return [];
    return user.transactions || [];
};

/**
 * NEW: Get categories from localStorage for the current user.
 * Categories are assumed to be stored as an array of objects:
 * [{ name: 'Salary', color: 'blue' }, { name: 'Food', color: 'red' }, ...]
 */
const getCategories = () => {
    const user = getCurrentUser();
    if (!user) return [];
    // Assuming categories are stored in the user object
    // --- TEMPORARY HARDCODED CATEGORIES REMOVED ---
    return user.categories || [];
};

/**
 * NEW: Get the color for a specific category name.
 */
const getCategoryColor = (tagName) => {
    const categories = getCategories();
    const category = categories.find(c => c.name.toLowerCase() === tagName.toLowerCase());
    // Fallback to a default color if category or color is not found
    return category ? category.color : 'gray'; 
};


// Calculate stats: balance, income, expense (No change needed here)
const calculateStats = (transactions) => {
    const income = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = income - expense;
    return { income, expense, balance };
};

// --- REMOVED: getBalanceTrend function and all its hardcoded logic ---


// Render recent transactions dynamically (Updated to use getCategoryColor)
const renderTransactions = (transactions) => {
    const container = document.getElementById('recent-transactions-container');
    if (!container) return;
    container.innerHTML = '';

    // Sort by date descending, take last 5
    const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    recent.forEach(t => {
        const color = t.amount >= 0 ? 'green' : 'red';
        const tagColor = getCategoryColor(t.tag); 
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center py-3 border-b border-gray-100';
        div.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-2 h-2 rounded-full bg-${color}-500"></div>
                <div>
                    <p class="font-medium text-gray-900">${t.title}</p>
                    <div class="flex items-center text-xs text-gray-500 mt-0.5">
                        <span class="px-2 py-0.5 bg-${tagColor}-500/10 text-${tagColor}-700 rounded font-medium mr-2">${t.tag}</span>
                        <span>${t.date}</span>
                    </div>
                </div>
            </div>
            <span class="text-lg font-semibold text-${color}-600">${t.amount >= 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}</span>
        `;
        container.appendChild(div);
    });
};

// --- REMOVED: getMonthLabel function ---

// --- REMOVED: drawLineChart function and all its hardcoded logic/placeholders ---


// ---------- Initialize Dashboard ---------- //

document.addEventListener('DOMContentLoaded', () => {
    // Display user info in header
    const user = getCurrentUser();
    if (user) {
        const nameElem = document.getElementById('header-name');
        const emailElem = document.getElementById('header-email');
        if (nameElem) nameElem.textContent = user.name || 'User';
        if (emailElem) emailElem.textContent = getCurrentUserEmail();
    }
    
    const transactions = getTransactions();

    // Update stat cards
    const stats = calculateStats(transactions);
    const totalElem = document.querySelector('.stat-card-total .stat-value');
    const incomeElem = document.querySelector('.stat-card-income .stat-value');
    const expenseElem = document.querySelector('.stat-card-expense .stat-value');
    if(totalElem) totalElem.textContent = formatCurrency(stats.balance);
    if(incomeElem) incomeElem.textContent = formatCurrency(stats.income);
    if(expenseElem) expenseElem.textContent = formatCurrency(stats.expense);

    // Render recent transactions
    renderTransactions(transactions);

    // --- REMOVED: Chart drawing initialization ---
    // The chart element in HTML should also be removed if it's no longer used.
    // E.g., The element with id 'balance-chart'
});