// Settings sub-content templates
const profileContentTemplate = () => `
    <div id="profile-tab-content" class="bg-white p-8 rounded-xl shadow-lg space-y-8">
        <h3 class="text-xl font-semibold text-gray-800 border-b pb-4">Profile Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
                <label for="full-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="full-name" value="John Doe" class="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-emerald-500 focus:border-emerald-500">
            </div>
            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value="john@example.com" disabled class="mt-1 block w-full border border-gray-300 bg-gray-50 rounded-xl shadow-sm p-3 text-gray-500">
            </div>
        </div>

        <div class="border-t pt-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Password</h4>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p class="text-sm text-gray-600 mb-4 sm:mb-0">Change your password for enhanced security.</p>
                <button class="flex items-center px-4 py-2 text-emerald-600 border border-emerald-600 bg-emerald-50 rounded-xl shadow-sm hover:bg-emerald-100 transition duration-150 text-sm font-medium">
                    <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Change Password
                </button>
            </div>
        </div>

        <!-- Save Button -->
        <div class="pt-4 flex justify-end">
            <button class="px-6 py-3 text-white bg-emerald-600 rounded-xl shadow-md hover:bg-emerald-700 transition duration-150 font-medium">
                Save Changes
            </button>
        </div>
    </div>
`;

const preferencesContentTemplate = () => `
    <div id="preferences-tab-content" class="bg-white p-8 rounded-xl shadow-lg space-y-8">
        <h3 class="text-xl font-semibold text-gray-800 border-b pb-4">App Preferences</h3>

        <!-- Currency Setting -->
        <div>
            <label for="currency" class="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select id="currency" class="mt-1 block w-full md:w-1/2 border border-gray-300 rounded-xl shadow-sm p-3 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white">
                <option>US Dollar (USD)</option>
                <option>Euro (EUR)</option>
                <option>British Pound (GBP)</option>
                <option>Japanese Yen (JPY)</option>
            </select>
        </div>

        <!-- Email Notifications Toggle -->
        <div class="border-t pt-6 flex justify-between items-center">
            <div>
                <h4 class="text-lg font-semibold text-gray-800">Email Notifications</h4>
                <p class="text-sm text-gray-500">Get notified about transactions and budgets.</p>
            </div>
            <!-- Custom Toggle Switch -->
            <label for="notification-toggle" class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="notification-toggle" class="toggle-checkbox" checked>
                <span class="toggle-label"></span>
            </label>
        </div>

        <!-- Save Button -->
        <div class="pt-4 flex justify-end">
            <button class="px-6 py-3 text-white bg-emerald-600 rounded-xl shadow-md hover:bg-emerald-700 transition duration-150 font-medium">
                Save Preferences
            </button>
        </div>
    </div>
`;

const accountContentTemplate = () => `
    <div id="account-tab-content" class="bg-white p-8 rounded-xl shadow-lg space-y-8">
       <div class="border-t pt-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h4>
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-red-50 p-4 rounded-xl border border-red-200">
                <p class="text-sm text-red-700 mb-4 sm:mb-0 font-medium">Permanently delete your account and all associated data.</p>
                <button class="flex items-center px-4 py-2 text-white bg-red-600 rounded-xl shadow-sm hover:bg-red-700 transition duration-150 text-sm font-medium">
                    Delete Account
                </button>
            </div>
        </div>
    </div>
`;

// Function to set up the tab switching logic
const setupSettingsTabs = () => {
    const tabsContainer = document.getElementById('settings-tabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', (e) => {
        const tabButton = e.target.closest('.settings-tab');
        if (!tabButton) return;

        const tabName = tabButton.getAttribute('data-tab');
        const contentDiv = document.getElementById('settings-content');
        const allTabs = document.querySelectorAll('#settings-tabs .settings-tab');

        // Update active tab styling
        allTabs.forEach(tab => {
            tab.classList.remove('settings-tab-active', 'text-gray-700');
            tab.classList.add('text-gray-500', 'hover:text-gray-700');
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('settings-tab-active');
                tab.classList.remove('text-gray-500');
            }
        });

        // Render new content
        let content = '';
        if (tabName === 'profile') {
            content = profileContentTemplate();
        } else if (tabName === 'preferences') {
            content = preferencesContentTemplate();
        } else if (tabName === 'account') {
            content = accountContentTemplate();
        }
        contentDiv.innerHTML = content;
    });
};

// Initialize settings tabs
document.addEventListener('DOMContentLoaded', () => {
    setupSettingsTabs();
});