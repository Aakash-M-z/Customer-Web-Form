// Modal Functions
function openCustomerModal() {
    document.getElementById('customerModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('customerForm').reset();
    document.getElementById('selectedFiles').innerHTML = '';
    document.getElementById('fileInfo').textContent = 'Accepted formats: PDF, XLSX, XLS';
}

// Automate Modal Functions
function openAutomateModal() {
    document.getElementById('automateModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeAutomateModal() {
    document.getElementById('automateModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.getElementById('automateForm').reset();
    document.getElementById('otherRevisionInput').classList.add('hidden');
}

// Delete Modal Functions
let customerToDelete = null;

function openDeleteModal(customerId) {
    customerToDelete = customerId;
    document.getElementById('deleteModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    customerToDelete = null;
}

function confirmDelete() {
    if (customerToDelete) {
        let customers = JSON.parse(localStorage.getItem('customers') || '[]');
        customers = customers.filter(c => c.id !== customerToDelete);
        localStorage.setItem('customers', JSON.stringify(customers));

        // Reload table
        loadCustomers();

        showToast('Customer deleted successfully!');
        closeDeleteModal();
    }
}

function handleRevisionChange() {
    const revisionSelect = document.getElementById('revisionSelect');
    const otherRevisionInput = document.getElementById('otherRevisionInput');

    if (revisionSelect.value === 'other') {
        otherRevisionInput.classList.remove('hidden');
        otherRevisionInput.classList.add('animate-fade-in-up');
    } else {
        otherRevisionInput.classList.add('hidden');
    }
}

// File Upload Handler
function handleFileSelect(event) {
    const files = event.target.files;
    const selectedFilesDiv = document.getElementById('selectedFiles');
    const fileInfo = document.getElementById('fileInfo');

    if (files.length > 0) {
        fileInfo.textContent = `${files.length} file(s) selected`;
        selectedFilesDiv.innerHTML = '';

        Array.from(files).forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg';
            fileItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-blue-600">description</span>
                    <div>
                        <p class="text-sm font-semibold text-slate-900 dark:text-white">${file.name}</p>
                        <p class="text-xs text-slate-500">${(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
                <button type="button" onclick="removeFile(${index})" class="text-slate-400 hover:text-red-500 transition-colors">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            `;
            selectedFilesDiv.appendChild(fileItem);
        });
    } else {
        fileInfo.textContent = 'Accepted formats: PDF, XLSX, XLS';
        selectedFilesDiv.innerHTML = '';
    }
}

function removeFile(index) {
    const fileInput = document.getElementById('fileUpload');
    const dt = new DataTransfer();
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
        if (i !== index) dt.items.add(files[i]);
    }

    fileInput.files = dt.files;
    handleFileSelect({ target: fileInput });
}

// Form Submission
document.addEventListener('DOMContentLoaded', function () {
    // Load existing customers on page load
    loadCustomers();

    // Form Submission
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                id: '#' + String(Date.now()).slice(-5),
                clientName: document.getElementById('clientName').value,
                purchaseOrder: document.getElementById('purchaseOrder').value,
                salesOrder: document.getElementById('salesOrder').value,
                emailAddress: document.getElementById('emailAddress').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                numDocuments: document.getElementById('numDocuments').value,
                status: document.getElementById('status').value,
                markAsNew: document.getElementById('markAsNew').checked,
                files: document.getElementById('fileUpload').files.length,
                timestamp: new Date().toLocaleString()
            };

            // Store in localStorage
            let customers = JSON.parse(localStorage.getItem('customers') || '[]');
            customers.unshift(formData); // Add to beginning of array
            localStorage.setItem('customers', JSON.stringify(customers));

            // Add to table immediately if possible
            if (document.querySelector('.premium-table tbody')) {
                addCustomerToTable(formData);
            }

            // Show toast
            showToast('Customer added successfully!');

            // Close modal
            closeCustomerModal();

            console.log('Customer data saved:', formData);
        });
    }

    // Close modal on outside click
    const customerModalElement = document.getElementById('customerModal');
    if (customerModalElement) {
        customerModalElement.addEventListener('click', function (e) {
            if (e.target === this) {
                closeCustomerModal();
            }
        });
    }

    // Automate Form Submission
    // Automate Form Submission
    const automateForm = document.getElementById('automateForm');
    if (automateForm) {
        automateForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const revisionSelect = document.getElementById('revisionSelect');
            const customRevision = document.getElementById('customRevision');

            let selectedRevision;
            if (revisionSelect.value === 'other') {
                selectedRevision = customRevision.value || 'Custom Revision';
            } else {
                selectedRevision = revisionSelect.options[revisionSelect.selectedIndex].text;
            }

            const automationData = {
                revision: selectedRevision,
                timestamp: new Date().toLocaleString()
            };

            // Store in localStorage
            let automations = JSON.parse(localStorage.getItem('automations') || '[]');
            automations.push(automationData);
            localStorage.setItem('automations', JSON.stringify(automations));

            // Show toast
            showToast(`Automation started with ${selectedRevision}!`);

            // Close modal
            closeAutomateModal();

            console.log('Automation data saved:', automationData);
        });
    }

    // Close automate modal on outside click
    const automateModal = document.getElementById('automateModal');
    if (automateModal) {
        automateModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeAutomateModal();
            }
        });
    }

    // Close delete modal on outside click
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeDeleteModal();
            }
        });
    }

    // Drag and drop functionality
    const dropZone = document.querySelector('label[for="fileUpload"]');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('border-primary', 'bg-blue-50', 'dark:bg-blue-900/20');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('border-primary', 'bg-blue-50', 'dark:bg-blue-900/20');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            document.getElementById('fileUpload').files = files;
            handleFileSelect({ target: { files: files } });
        });
    }

    // Initialize Dashboard if on index.html
    if (document.getElementById('recentCustomersTable')) {
        loadCustomers();
    }
});

// --- NEW ENHANCEMENTS START HERE ---

// Dummy Data Arrays
let allCustomers = [];
let allAutomations = [];
let filteredCustomers = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentStatusFilter = 'All';
let currentSearchQuery = '';
let currentAutomationFilter = 'All';
let filteredAutomations = [];

// Realistic Names and Companies for Dummy Data
const dummyNames = ["James Smith", "Michael Johnson", "Robert Williams", "Maria Garcia", "David Miller", "Linda Davis", "Richard Rodriguez", "Susan Martinez", "Joseph Hernandez", "Karen Moore", "Christopher Taylor", "Nancy Anderson", "Thomas Thomas", "Betty Jackson", "Daniel White", "Margaret Harris", "Matthew Martin", "Sandra Thompson", "Anthony Garcia", "Ashley Martinez", "Mark Robinson", "Dorothy Clark", "Paul Rodriguez", "Kimberly Lewis", "Steven Lee", "Emily Walker", "Andrew Hall", "Donna Allen", "Kenneth Young", "Michelle Hernandez"];
const dummyCompanies = ["Acme Corp", "Globex Corporation", "Soylent Corp", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises", "Hooli", "Pied Piper", "Massive Dynamic", "Vandelay Industries", "Cyberdyne Systems", "Aperture Science", "Bluth Company", "E Corp"];
const dummyStatuses = ["Active", "Pending", "Inactive"];
const dummyTags = ["Enterprise", "Mid-Market", "High Value", "Strategic"];

// Generate Dummy Data
function generateDummyData() {
    // Generate 50 Customers
    for (let i = 1; i <= 50; i++) {
        const name = dummyNames[Math.floor(Math.random() * dummyNames.length)] + " " + String(i);
        allCustomers.push({
            id: `#C-10${50 + i}`,
            name: name,
            email: name.toLowerCase().replace(" ", ".") + "@example.com",
            phone: `+1 (${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
            docs: i % 3 === 0 ? ["PDF", "XLS"] : i % 2 === 0 ? ["PDF"] : ["XLS"],
            createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
            status: dummyStatuses[Math.floor(Math.random() * dummyStatuses.length)]
        });
    }

    // Generate 50 Automations
    for (let i = 1; i <= 50; i++) {
        const name = dummyNames[Math.floor(Math.random() * dummyNames.length)];
        allAutomations.push({
            excelId: `EXL-${1000 + i}`,
            name: name,
            email: name.toLowerCase().replace(" ", ".") + "@corp.com",
            phone: `+1 (${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
            targetCustomer: dummyTags[Math.floor(Math.random() * dummyTags.length)]
        });
    }
}

// Customers Page Initialization
function initCustomersPage() {
    console.log("Initializing Customers Page...");
    if (allCustomers.length === 0) generateDummyData();
    updateFilters();
}

// Search Handler
function handleSearch(query) {
    currentSearchQuery = query.toLowerCase();
    updateFilters();
}

// Global Filter Logic
function updateFilters() {
    filteredCustomers = allCustomers.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(currentSearchQuery) ||
            c.email.toLowerCase().includes(currentSearchQuery) ||
            c.id.toLowerCase().includes(currentSearchQuery);
        const matchesStatus = currentStatusFilter === 'All' || c.status === currentStatusFilter;
        return matchesSearch && matchesStatus;
    });
    currentPage = 1;
    renderCustomerTable(1);
}

function toggleFilterMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('filterMenu');
    menu.classList.toggle('hidden');

    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.classList.add('hidden');
            document.removeEventListener('click', closeMenu);
        }
    };
    document.addEventListener('click', closeMenu);
}

function setStatusFilter(status) {
    currentStatusFilter = status;

    // Update checkmarks in UI
    const statuses = ['All', 'Active', 'Pending', 'Inactive'];
    statuses.forEach(s => {
        const check = document.getElementById(`check-${s}`);
        if (check) {
            if (s === status) check.classList.remove('hidden');
            else check.classList.add('hidden');
        }
    });

    updateFilters();
    document.getElementById('filterMenu').classList.add('hidden');
    showToast(`Filtering by: ${status}`);
}

// Render Customer Table
function renderCustomerTable(page) {
    const tbody = document.getElementById('customerTableBody');
    if (!tbody) return;

    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredCustomers.slice(start, end);

    tbody.innerHTML = '';

    paginatedItems.forEach(customer => {
        const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const statusClass = customer.status === 'Active' ? 'badge-active' : customer.status === 'Pending' ? 'badge-pending' : 'badge-inactive';
        const statusDot = customer.status === 'Active' ? 'bg-emerald-500' : customer.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500';

        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer';
        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-slate-500 font-medium">${customer.id}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">${initials}</div>
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">${customer.name}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">${customer.email}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${customer.phone}</td>
            <td class="px-6 py-4">
                <div class="flex gap-1">
                    ${customer.docs.map(doc => `<span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 border border-slate-200">${doc}</span>`).join('')}
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">${customer.createdDate}</td>
            <td class="px-6 py-4">
                <span class="${statusClass} px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center">
                    <span class="size-1.5 rounded-full ${statusDot} mr-1.5"></span> ${customer.status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                    <button onclick="handleUploadClick()" class="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                        <span class="material-symbols-outlined text-[18px]">upload</span>
                    </button>
                    <button onclick="handleDeleteRow('${customer.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 transition-all">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <button class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <span class="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    updatePaginationUI();
}

function updatePaginationUI() {
    const info = document.getElementById('paginationInfo');
    const buttons = document.getElementById('paginationButtons');
    if (!info || !buttons) return;

    const total = filteredCustomers.length;
    const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);

    info.innerHTML = `Showing <span class="font-medium text-slate-900 dark:text-white">${start}</span> to <span class="font-medium text-slate-900 dark:text-white">${end}</span> of <span class="font-medium text-slate-900 dark:text-white">${total}</span> customers`;

    const totalPages = Math.ceil(total / itemsPerPage);
    let btnHtml = `
        <button onclick="renderCustomerTable(${currentPage - 1})" class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30" ${currentPage === 1 ? 'disabled' : ''}>
            <span class="material-symbols-outlined">chevron_left</span>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            btnHtml += `<button onclick="renderCustomerTable(${i})" class="size-9 rounded-lg ${currentPage === i ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'} text-sm font-medium transition-all">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            btnHtml += `<span class="px-1 text-slate-400">...</span>`;
        }
    }

    btnHtml += `
        <button onclick="renderCustomerTable(${currentPage + 1})" class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30" ${currentPage === totalPages || total === 0 ? 'disabled' : ''}>
            <span class="material-symbols-outlined">chevron_right</span>
        </button>
    `;
    buttons.innerHTML = btnHtml;
}

// Action Handlers
function handleUploadClick() {
    document.getElementById('demoUploadInput').click();
}

function handleDeleteRow(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        allCustomers = allCustomers.filter(c => c.id !== id);
        filteredCustomers = filteredCustomers.filter(c => c.id !== id);
        renderCustomerTable(currentPage);
        showToast('Customer removed from directory');
    }
}

// Automation Page Initialization
function initAutomationPage() {
    console.log("Initializing Automation Page...");
    if (allAutomations.length === 0) generateDummyData();
    updateAutomationFilters();
    updateAutomationStats();
}

function updateAutomationFilters() {
    filteredAutomations = allAutomations.filter(item => {
        return currentAutomationFilter === 'All' || item.targetCustomer === currentAutomationFilter;
    });
    renderAutomationTable();
}

function toggleAutomationFilterMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('automationFilterMenu');
    menu.classList.toggle('hidden');

    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.classList.add('hidden');
            document.removeEventListener('click', closeMenu);
        }
    };
    document.addEventListener('click', closeMenu);
}

function setAutomationFilter(category) {
    currentAutomationFilter = category;

    // Update checkmarks
    const categories = ['All', 'Enterprise', 'Mid-Market', 'High Value', 'Strategic'];
    categories.forEach(c => {
        const check = document.getElementById(`check-auto-${c}`);
        if (check) {
            if (c === category) check.classList.remove('hidden');
            else check.classList.add('hidden');
        }
    });

    updateAutomationFilters();
    document.getElementById('automationFilterMenu').classList.add('hidden');
    showToast(`Category: ${category}`);
}

function renderAutomationTable() {
    const tbody = document.getElementById('automationTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    filteredAutomations.slice(0, 15).forEach(item => {
        let tagClass = 'bg-blue-50 text-blue-600 border-blue-200';
        if (item.targetCustomer === 'Strategic') tagClass = 'bg-purple-50 text-purple-600 border-purple-200';
        if (item.targetCustomer === 'High Value') tagClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
        if (item.targetCustomer === 'Mid-Market') tagClass = 'bg-amber-50 text-amber-600 border-amber-200';

        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group';
        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-slate-500 font-medium">${item.excelId}</td>
            <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">${item.name}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${item.email}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${item.phone}</td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${tagClass} uppercase tracking-wider">
                    ${item.targetCustomer}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button class="p-1.5 rounded-lg text-slate-400 hover:text-primary transition-all">
                    <span class="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateAutomationStats() {
    if (!document.getElementById('stat-total')) return;
    document.getElementById('stat-total').textContent = '1,240';
    document.getElementById('stat-validated').textContent = '856';
    document.getElementById('stat-pending').textContent = '384';
    document.getElementById('stat-tagged').textContent = '1,102';
}

function handleAutomate() {
    showToast('Processing 1,240 records...');
    setTimeout(() => {
        showToast('Automation completed successfully!');
    }, 2000);
}


function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Function to add customer to table
function addCustomerToTable(customer) {
    const tbody = document.querySelector('.premium-table tbody');
    const row = document.createElement('tr');
    row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer';

    // Get first letter of customer name for avatar
    const firstLetter = customer.clientName.charAt(0).toUpperCase();

    // Determine badge class based on status
    let badgeClass = 'badge-active';
    if (customer.status === 'Pending') badgeClass = 'badge-pending';
    if (customer.status === 'Inactive') badgeClass = 'badge-inactive';

    row.innerHTML = `
        <td class="px-6 py-4 text-sm text-slate-500">${customer.id}</td>
        <td class="px-6 py-4">
            <div class="flex items-center gap-3">
                <div class="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-semibold text-primary">${firstLetter}</div>
                <span class="text-sm font-medium text-slate-900 dark:text-white">${customer.clientName}</span>
            </div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-500 font-medium">${customer.purchaseOrder || 'N/A'}</td>
        <td class="px-6 py-4 text-sm ${customer.files > 0 ? 'text-primary' : 'text-slate-400'} font-medium">${customer.files} File${customer.files !== 1 ? 's' : ''}</td>
        <td class="px-6 py-4">
            <span class="${badgeClass} px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center">
                <span class="size-1.5 rounded-full ${customer.status === 'Active' ? 'bg-emerald-500' : customer.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'} mr-1.5"></span> ${customer.status}
            </span>
        </td>
        <td class="px-6 py-4 text-right">
            <button class="action-icon text-slate-400 hover:text-primary transition-colors" onclick="deleteCustomer('${customer.id}')">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </td>
    `;

    // Insert at the beginning of tbody
    tbody.insertBefore(row, tbody.firstChild);
}

// Function to load customers from localStorage
function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const tbody = document.querySelector('.premium-table tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    // If no customers, show default data
    if (customers.length === 0) {
        tbody.innerHTML = `
            <tr class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer">
                <td class="px-6 py-4 text-sm text-slate-500">#00124</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-semibold text-primary">A</div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white">Acme Global Inc.</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 font-medium">PO-99231</td>
                <td class="px-6 py-4 text-sm text-primary font-medium">3 Files</td>
                <td class="px-6 py-4">
                    <span class="badge-active px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center">
                        <span class="size-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Active
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="action-icon text-slate-400 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined">more_horiz</span>
                    </button>
                </td>
            </tr>
            <tr class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer">
                <td class="px-6 py-4 text-sm text-slate-500">#00125</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-semibold text-primary">S</div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white">Stark Industries</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 font-medium">PO-88210</td>
                <td class="px-6 py-4 text-sm text-slate-400 font-medium">0 Files</td>
                <td class="px-6 py-4">
                    <span class="badge-pending px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center">
                        <span class="size-1.5 rounded-full bg-amber-500 mr-1.5"></span> Pending
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="action-icon text-slate-400 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined">more_horiz</span>
                    </button>
                </td>
            </tr>
        `;
    } else {
        // Add customers from localStorage (newest first)
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer';

            // Get first letter of customer name for avatar
            const firstLetter = customer.clientName.charAt(0).toUpperCase();

            // Determine badge class based on status
            let badgeClass = 'badge-active';
            if (customer.status === 'Pending') badgeClass = 'badge-pending';
            if (customer.status === 'Inactive') badgeClass = 'badge-inactive';

            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-slate-500">${customer.id}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-semibold text-primary">${firstLetter}</div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white">${customer.clientName}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 font-medium">${customer.purchaseOrder || 'N/A'}</td>
                <td class="px-6 py-4 text-sm ${customer.files > 0 ? 'text-primary' : 'text-slate-400'} font-medium">${customer.files} File${customer.files !== 1 ? 's' : ''}</td>
                <td class="px-6 py-4">
                    <span class="${badgeClass} px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center">
                        <span class="size-1.5 rounded-full ${customer.status === 'Active' ? 'bg-emerald-500' : customer.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'} mr-1.5"></span> ${customer.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="action-icon text-slate-400 hover:text-primary transition-colors" onclick="deleteCustomer('${customer.id}')">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });
    }
}

// Function to delete customer
function deleteCustomer(customerId) {
    openDeleteModal(customerId);
}

// Excel Table Select All Functionality
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const rowCheckboxes = document.querySelectorAll('.excel-row-checkbox');

    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });

    console.log('Select All clicked:', selectAllCheckbox.checked);
    console.log('Total checkboxes:', rowCheckboxes.length);
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const rowCheckboxes = document.querySelectorAll('.excel-row-checkbox');
    const checkedCount = document.querySelectorAll('.excel-row-checkbox:checked').length;

    console.log('Checked count:', checkedCount, 'Total:', rowCheckboxes.length);

    // If all checkboxes are checked, check the select all checkbox
    if (checkedCount === rowCheckboxes.length && rowCheckboxes.length > 0) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    }
    // If some but not all are checked, show indeterminate state
    else if (checkedCount > 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
    // If none are checked, uncheck the select all checkbox
    else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
}
