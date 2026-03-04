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

let itemToDelete = null;
let deleteType = 'customer';

function openDeleteModal(id, type = 'customer') {
    itemToDelete = id;
    deleteType = type;

    showCustomModal({
        title: type === 'customer' ? 'Delete Customer' : 'Delete Record',
        message: type === 'customer'
            ? 'Are you sure you want to delete this customer? This action cannot be undone.'
            : 'Are you sure you want to remove this record from the automation list?',
        type: 'delete',
        confirmText: '<span class="material-symbols-outlined text-[20px]">delete</span> Delete',
        cancelText: 'Cancel',
        onConfirm: () => confirmDelete()
    });
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    itemToDelete = null;
}

function confirmDelete() {
    if (itemToDelete) {
        if (deleteType === 'customer') {
            // Local Storage check for index.html/dashboard
            let customers = JSON.parse(localStorage.getItem('customers') || '[]');
            const initialLength = customers.length;
            customers = customers.filter(c => c.id !== itemToDelete);

            if (customers.length !== initialLength) {
                localStorage.setItem('customers', JSON.stringify(customers));
                if (typeof loadCustomers === 'function') loadCustomers();
            }

            // Memory array check for customers.html dummy data
            if (typeof allCustomers !== 'undefined' && allCustomers.length > 0) {
                allCustomers = allCustomers.filter(c => c.id !== itemToDelete);
                if (typeof filteredCustomers !== 'undefined') {
                    filteredCustomers = filteredCustomers.filter(c => c.id !== itemToDelete);
                }
                if (typeof renderCustomerTable === 'function') renderCustomerTable(currentPage);
            }
            showToast('Customer deleted successfully!');
        } else if (deleteType === 'automation') {
            if (typeof allAutomations !== 'undefined') {
                allAutomations = allAutomations.filter(a => a.excelId !== itemToDelete);
                if (typeof filteredAutomations !== 'undefined') {
                    filteredAutomations = filteredAutomations.filter(a => a.excelId !== itemToDelete);
                }
                if (typeof renderAutomationTable === 'function') renderAutomationTable();
            }
            showCustomModal({ title: 'Action Completed', message: 'Automation record removed successfully.', type: 'success' });
        }
        itemToDelete = null;
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

document.addEventListener('DOMContentLoaded', function () {
    // Initialize user session first
    initUserSession();

    // Add initial dummy data to localStorage if empty (for dashboard display)
    if (!localStorage.getItem('customers') || JSON.parse(localStorage.getItem('customers')).length === 0) {
        const initialCustomers = [
            {
                id: '#C-1001',
                clientName: 'Aakash Leo',
                emailAddress: 'aakash.leo@example.com',
                phoneNumber: '+1 (555) 123-4567',
                purchaseOrder: 'PO-1023',
                salesOrder: 'SO-2023',
                numDocuments: '3',
                status: 'Active',
                files: 3,
                timestamp: new Date().toLocaleString()
            },
            {
                id: '#C-1002',
                clientName: 'John Carter',
                emailAddress: 'john.carter@example.com',
                phoneNumber: '+1 (555) 234-5678',
                purchaseOrder: 'PO-1024',
                salesOrder: 'SO-2024',
                numDocuments: '1',
                status: 'Pending',
                files: 1,
                timestamp: new Date().toLocaleString()
            },
            {
                id: '#C-1003',
                clientName: 'Sarah Lee',
                emailAddress: 'sarah.lee@example.com',
                phoneNumber: '+1 (555) 345-6789',
                purchaseOrder: 'PO-1025',
                salesOrder: 'SO-2025',
                numDocuments: '2',
                status: 'Inactive',
                files: 2,
                timestamp: new Date().toLocaleString()
            },
            {
                id: '#C-1004',
                clientName: 'David Miller',
                emailAddress: 'david.miller@example.com',
                phoneNumber: '+1 (555) 456-7890',
                purchaseOrder: 'PO-1026',
                salesOrder: 'SO-2026',
                numDocuments: '0',
                status: 'Inactive',
                files: 0,
                timestamp: new Date().toLocaleString()
            },
            {
                id: '#C-1005',
                clientName: 'Emily Watson',
                emailAddress: 'emily.watson@example.com',
                phoneNumber: '+1 (555) 567-8901',
                purchaseOrder: 'PO-1027',
                salesOrder: 'SO-2027',
                numDocuments: '4',
                status: 'Inactive',
                files: 4,
                timestamp: new Date().toLocaleString()
            }
        ];
        localStorage.setItem('customers', JSON.stringify(initialCustomers));
    }

    // Set active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('nav-active');
        } else {
            link.classList.remove('nav-active');
        }
    });

    // Global click handler for closing menus
    document.addEventListener('click', (e) => {
        const filterMenu = document.getElementById('filterMenu');
        const autoFilterMenu = document.getElementById('automationFilterMenu');

        if (filterMenu && !filterMenu.contains(e.target) && !e.target.closest('button[onclick*="toggleFilterMenu"]')) {
            filterMenu.classList.add('hidden');
        }
        if (autoFilterMenu && !autoFilterMenu.contains(e.target) && !e.target.closest('button[onclick*="toggleAutomationFilterMenu"]')) {
            autoFilterMenu.classList.add('hidden');
        }
        const actionDropdown = document.getElementById('actionDropdown');
        if (actionDropdown && !actionDropdown.contains(e.target) && !e.target.closest('button[onclick*="handleMoreActions"]')) {
            actionDropdown.style.display = 'none';
        }
    });

    // Load elements ONLY if on their respective pages
    if (document.getElementById('recentCustomersBody')) loadCustomers();
    if (document.getElementById('dashboardAutomationBody')) loadDashboardAutomations();
    if (document.getElementById('customerTableBody')) initCustomersPage();
    if (document.getElementById('automationTableBody')) initAutomationPage();

    initActionDropdown();

    // Chart.js initialization
    if (document.getElementById('growthChart') || document.getElementById('statusChart')) {
        initCharts();
    }

    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');

            withLoading(submitBtn, async () => {
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

                // Close modal
                closeCustomerModal();

                // Show custom modal
                showCustomModal({
                    title: 'Action Completed',
                    message: 'Customer added successfully!',
                    type: 'success'
                });

                console.log('Customer data saved:', formData);
            });
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

            // Close modal
            closeAutomateModal();

            // Show custom modal
            showCustomModal({
                title: 'Action Completed',
                message: `Automation started with ${selectedRevision}!`,
                type: 'success'
            });

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

    // Initialize Charts if on index.html
    if (document.getElementById('growthChart') || document.getElementById('statusChart')) {
        initCharts();
    }
});

function getCustomerStatusCounts() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const counts = { Active: 0, Pending: 0, Inactive: 0 };

    // Add dummy data for visual balance if empty
    if (customers.length === 0) {
        return [65, 25, 10];
    }

    customers.forEach(c => {
        // Normalize status - treat Suspended as Inactive
        let status = c.status;
        if (status === 'Suspended') status = 'Inactive';

        if (counts[status] !== undefined) {
            counts[status]++;
        }
    });

    console.log('Customer Status Counts:', counts);
    console.log('Chart Data Array:', [counts.Active, counts.Pending, counts.Inactive]);

    return [counts.Active, counts.Pending, counts.Inactive];
}

// Global chart instances to prevent 'Canvas in use' errors
let growthChartInstance = null;
let statusChartInstance = null;

// Chart Initialization
function initCharts() {
    const isDark = document.documentElement.classList.contains('dark');
    const primaryColor = '#2563eb';
    const emeraldColor = '#059669';
    const amberColor = '#d97706';
    const redColor = '#dc2626';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)';

    const statusData = getCustomerStatusCounts();
    console.log('Initializing chart with statusData:', statusData);
    console.log('Colors - Green:', emeraldColor, 'Amber:', amberColor, 'Red:', redColor);

    // Growth Chart (Line)
    const growthCanvas = document.getElementById('growthChart');
    if (growthCanvas) {
        if (growthChartInstance) {
            growthChartInstance.destroy();
        }

        const growthCtx = growthCanvas.getContext('2d');

        // Create Gradient
        const gradient = growthCtx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

        growthChartInstance = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'New Customers',
                    data: [45, 59, 80, 81, 96, 120],
                    borderColor: primaryColor,
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: primaryColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: primaryColor,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        padding: 12,
                        backgroundColor: isDark ? '#1e293b' : '#fff',
                        titleColor: isDark ? '#f1f5f9' : '#1e293b',
                        bodyColor: isDark ? '#94a3b8' : '#64748b',
                        borderColor: gridColor,
                        borderWidth: 1,
                        usePointStyle: true,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor,
                            font: { size: 11, weight: '500' }
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: textColor,
                            font: { size: 11, weight: '500' },
                            stepSize: 30
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    // Status Chart (Pie/Doughnut)
    const statusCanvas = document.getElementById('statusChart');
    if (statusCanvas) {
        if (statusChartInstance) {
            statusChartInstance.destroy();
        }

        const statusCtx = statusCanvas.getContext('2d');
        statusChartInstance = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Pending', 'Inactive'],
                datasets: [{
                    data: statusData,
                    backgroundColor: [emeraldColor, amberColor, redColor],
                    hoverOffset: 15,
                    borderWidth: 0,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 12, weight: '600' },
                            color: textColor
                        }
                    },
                    tooltip: {
                        padding: 12,
                        backgroundColor: isDark ? '#1e293b' : '#fff',
                        titleColor: isDark ? '#f1f5f9' : '#1e293b',
                        bodyColor: isDark ? '#94a3b8' : '#64748b',
                        borderColor: gridColor,
                        borderWidth: 1,
                        displayColors: false
                    }
                }
            }
        });
    }
}

// --- NEW ENHANCEMENTS START HERE ---

// Dummy Data Arrays
let allCustomers = [];
let allAutomations = [];
let filteredAutomations = [];
let currentAutomationFilter = 'All';
let automationSearchQuery = '';
let automationPage = 1;
let automationPageSize = 10;
let automationSortCol = 'excelId';
let automationSortDir = 'asc';
const itemsPerPage = 10;
let currentPage = 1;
let currentStatusFilter = 'All';
let currentSearchQuery = '';
let filteredCustomers = [];

// Realistic Names and Companies for Dummy Data
const dummyNames = ["James Smith", "Michael Johnson", "Robert Williams", "Maria Garcia", "David Miller", "Linda Davis", "Richard Rodriguez", "Susan Martinez", "Joseph Hernandez", "Karen Moore", "Christopher Taylor", "Nancy Anderson", "Thomas Thomas", "Betty Jackson", "Daniel White", "Margaret Harris", "Matthew Martin", "Sandra Thompson", "Anthony Garcia", "Ashley Martinez", "Mark Robinson", "Dorothy Clark", "Paul Rodriguez", "Kimberly Lewis", "Steven Lee", "Emily Walker", "Andrew Hall", "Donna Allen", "Kenneth Young", "Michelle Hernandez"];
const dummyCompanies = ["Acme Corp", "Globex Corporation", "Soylent Corp", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises", "Hooli", "Pied Piper", "Massive Dynamic", "Vandelay Industries", "Cyberdyne Systems", "Aperture Science", "Bluth Company", "E Corp"];
const dummyStatuses = ["Active", "Pending", "Inactive", "Suspended"];
const dummyTags = ["Enterprise", "Mid-Market", "High Value", "Strategic"];

// Generate Dummy Data
function generateDummyData() {
    // Generate 50 Customers
    for (let i = 1; i <= 50; i++) {
        const name = dummyNames[Math.floor(Math.random() * dummyNames.length)] + " " + String(i);
        const status = dummyStatuses[Math.floor(Math.random() * dummyStatuses.length)];
        allCustomers.push({
            id: `#C-10${50 + i}`,
            name: name,
            email: name.toLowerCase().replace(" ", ".") + "@example.com",
            phone: `+1 (${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
            purchaseOrder: `PO-10${20 + i}`,
            docs: i % 3 === 0 ? ["PDF", "XLS", "DOC"] : i % 2 === 0 ? ["PDF"] : ["XLS"],
            createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
            status: status
        });
    }

    // Generate 50 Automations
    for (let i = 1; i <= 50; i++) {
        const name = dummyNames[Math.floor(Math.random() * dummyNames.length)];
        const autoTags = ["High Value", "Enterprise", "Mid-Market"];
        const autoStatuses = ["Automated", "Pending", "Failed"];
        allAutomations.push({
            excelId: `EXL-${1000 + i}`,
            name: name,
            email: name.toLowerCase().replace(" ", ".") + "@corp.com",
            phone: `+1 (${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
            targetCustomer: autoTags[Math.floor(Math.random() * autoTags.length)],
            status: autoStatuses[Math.floor(Math.random() * autoStatuses.length)]
        });
    }
}

// Customers Page Initialization
function initCustomersPage() {
    console.log("Initializing Customers Page...");
    if (allCustomers.length === 0) generateDummyData();
    filterCustomers();
}

// Search and Filter Functions
function handleSearch(query) {
    currentSearchQuery = query.toLowerCase();
    filterCustomers();
}

async function filterCustomers() {
    // Show Loading
    const tbody = document.getElementById('customerTableBody');
    if (tbody) showSkeleton('customerTableBody', 8);

    // Get search query from any available search input if not explicitly passed
    const searchInput = document.getElementById('customerSearch') || document.getElementById('customerSearchMain');
    if (searchInput) {
        currentSearchQuery = searchInput.value.toLowerCase();
    }

    filteredCustomers = allCustomers.filter(customer => {
        const name = customer.name || customer.clientName || '';
        const email = customer.email || customer.emailAddress || '';
        const id = customer.id || '';

        const matchesSearch = name.toLowerCase().includes(currentSearchQuery) ||
            email.toLowerCase().includes(currentSearchQuery) ||
            id.toLowerCase().includes(currentSearchQuery);
        const matchesStatus = currentStatusFilter === 'All' || customer.status === currentStatusFilter;
        return matchesSearch && matchesStatus;
    });

    if (tbody) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Minimal delay for feel
    }
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
    filterCustomers();
    showToast(`Filtering by: ${status}`);
}

// Render Customer Table
async function renderCustomerTable(page) {
    const tbody = document.getElementById('customerTableBody');
    if (!tbody) return;

    // Show Loading State
    showSkeleton('customerTableBody', 8);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredCustomers.slice(start, end);

    tbody.innerHTML = '';

    if (paginatedItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12">
                    <div class="empty-state-container">
                        <span class="material-symbols-outlined empty-state-icon">person_off</span>
                        <h3 class="text-lg font-bold text-slate-900 dark:text-white">No customers found</h3>
                        <p class="text-sm text-slate-500 max-w-xs mx-auto">Try adjusting your search filters or add a new customer to the directory.</p>
                        <button onclick="openCustomerModal()" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Add New Customer</button>
                    </div>
                </td>
            </tr>
        `;
        updatePaginationUI();
        return;
    }

    paginatedItems.forEach(customer => {
        const initials = (customer.name || 'CU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        // Polished status logic
        let statusClass = 'bg-slate-100 text-slate-600';
        let statusDot = 'bg-slate-400';

        switch (customer.status) {
            case 'Active': statusClass = 'badge-active'; statusDot = 'bg-emerald-500'; break;
            case 'Pending': statusClass = 'badge-pending'; statusDot = 'bg-amber-500'; break;
            case 'Inactive': statusClass = 'badge-inactive'; statusDot = 'bg-red-500'; break;
            case 'Suspended': statusClass = 'bg-slate-100 text-slate-600 border-slate-200'; statusDot = 'bg-slate-400'; break;
        }

        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group cursor-pointer';
        row.onclick = (e) => {
            if (!e.target.closest('button')) openQuickView(customer.id);
        };

        row.innerHTML = `
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs transition-transform group-hover:scale-110">${initials}</div>
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">${customer.name || '-'}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500 font-medium">${customer.purchaseOrder || customer.purchaseOrder || 'PO-00000'}</td>
            <td class="px-6 py-4">
                <div class="flex gap-1 flex-wrap">
                    ${(customer.docs || []).map(doc => `<span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 border border-slate-200">${doc}</span>`).join('') || '-'}
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="${statusClass} px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center shadow-sm">
                    <span class="size-1.5 rounded-full ${statusDot} mr-1.5 animate-pulse"></span> ${customer.status || 'Unknown'}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="handleMoreActions(event, '${customer.id}', 'customer')" class="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all active:scale-90">
                    <span class="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
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
function initActionDropdown() {
    if (document.getElementById('actionDropdown')) return;

    const dropdown = document.createElement('div');
    dropdown.id = 'actionDropdown';
    dropdown.className = 'dropdown-menu';
    document.body.appendChild(dropdown);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && !e.target.closest('.p-2.rounded-lg.text-slate-400')) {
            dropdown.classList.add('hidden');
        }
    });
}

let activeActionId = null;
let activeActionType = 'customer';

function handleMoreActions(event, id, type = 'customer') {
    event.stopPropagation();
    activeActionId = id;
    activeActionType = type;

    const dropdown = document.getElementById('actionDropdown');
    if (!dropdown) {
        initActionDropdown(); // Initialize if not already present
        return handleMoreActions(event, id, type); // Re-call to populate and position
    }

    const isAutomation = type === 'automation';

    // Define menu items based on type
    const actions = isAutomation ? [
        { label: 'View Details', icon: 'visibility', action: 'view' },
        { label: 'Edit Record', icon: 'edit_note', action: 'edit' },
        { label: 'Archive', icon: 'archive', action: 'archive' },
        { label: 'Delete', icon: 'delete', action: 'delete', class: 'text-red-500' }
    ] : [
        { label: 'Upload Document', icon: 'upload_file', action: 'upload' },
        { label: 'Edit', icon: 'edit_note', action: 'edit' },
        { label: 'View', icon: 'visibility', action: 'view' },
        { label: 'Delete', icon: 'delete', action: 'delete', class: 'text-red-500' }
    ];

    let dropdownHtml = `
        <div class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</div>
    `;
    actions.forEach(item => {
        dropdownHtml += `
            <button class="dropdown-item ${item.class || ''}" onclick="handleAction('${item.action}')">
                <span class="material-symbols-outlined">${item.icon}</span> ${item.label}
            </button>
        `;
    });
    dropdown.innerHTML = dropdownHtml;

    // Show it so we can calculate dimensions
    dropdown.classList.remove('hidden');
    dropdown.style.display = 'block';

    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();

    // Fixed position element, so we use rect directly without window.scrollY
    let top = rect.bottom + 4;
    let left = rect.right - dropdownRect.width;

    // Check if dropdown goes off-screen vertically
    if (top + dropdownRect.height > window.innerHeight) {
        top = rect.top - dropdownRect.height - 4;
    }

    // Horizontal safety check
    if (left < 10) left = 10;

    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${left}px`;
}

function handleLoadMore() {
    // If the user refers to a "Load More" action, we ensure pagination or list expansion works
    showToast('Loading additional records...');
    setTimeout(() => {
        if (typeof renderCustomerTable === 'function') {
            itemsPerPage += 10;
            renderCustomerTable(currentPage);
        }
    }, 800);
}

function handleAction(type) {
    const dropdown = document.getElementById('actionDropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
        dropdown.style.display = 'none'; // Ensure it's fully hidden
    }

    switch (type) {
        case 'view':
            if (activeActionType === 'automation') {
                openAutomationQuickView(activeActionId);
            } else {
                openQuickView(activeActionId);
            }
            break;
        case 'edit':
            if (activeActionType === 'automation') {
                openEditRecordModal(activeActionId);
            } else {
                openEditCustomerModal(activeActionId);
            }
            break;
        case 'upload':
            openUploadModal(activeActionId);
            break;
        case 'delete':
            openDeleteModal(activeActionId, activeActionType);
            break;
        case 'archive':
            showToast(`Archiving record: ${activeActionId}...`);
            setTimeout(() => {
                // Remove from all arrays
                if (typeof allCustomers !== 'undefined') allCustomers = allCustomers.filter(c => c.id !== activeActionId);
                if (typeof filteredCustomers !== 'undefined') filteredCustomers = filteredCustomers.filter(c => c.id !== activeActionId);
                if (typeof allAutomations !== 'undefined') allAutomations = allAutomations.filter(a => a.excelId !== activeActionId);
                if (typeof filteredAutomations !== 'undefined') filteredAutomations = filteredAutomations.filter(a => a.excelId !== activeActionId);

                // Remove from localStorage
                let stored = JSON.parse(localStorage.getItem('customers') || '[]');
                if (stored.some(c => c.id === activeActionId)) {
                    stored = stored.filter(c => c.id !== activeActionId);
                    localStorage.setItem('customers', JSON.stringify(stored));
                }

                // Update UIs
                if (document.getElementById('recentCustomersBody')) loadCustomers();
                if (typeof renderCustomerTable === 'function') renderCustomerTable(currentPage);
                if (typeof renderAutomationTable === 'function') renderAutomationTable();

                // Update Charts
                if (document.getElementById('growthChart') || document.getElementById('statusChart')) {
                    if (typeof initCharts === 'function') initCharts();
                }

                showToast(`Record ${activeActionId} archived!`);
            }, 800);
            break;
    }
}

function handleDeleteRow(id) {
    openDeleteModal(id, 'customer');
}

// Automation Page Initialization
function initAutomationPage() {
    console.log("Initializing Automation Page...");
    if (allAutomations.length === 0) generateDummyData();
    updateAutomationFilters();
    updateAutomationStats();
    initActionDropdown(); // Ensure dropdown is initialized for automation table
}

function setAutomationFilter(status) {
    currentAutomationFilter = status;
    updateAutomationFilters();
}

function updateAutomationFilters() {
    filteredAutomations = allAutomations.filter(item => {
        const matchesStatus = currentAutomationFilter === 'All' || item.status === currentAutomationFilter;
        const searchStr = `${item.excelId} ${item.name} ${item.email}`.toLowerCase();
        const matchesSearch = searchStr.includes(automationSearchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Sorting
    filteredAutomations.sort((a, b) => {
        let valA = a[automationSortCol] || '';
        let valB = b[automationSortCol] || '';

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return automationSortDir === 'asc' ? -1 : 1;
        if (valA > valB) return automationSortDir === 'asc' ? 1 : -1;
        return 0;
    });

    automationPage = 1; // Reset to first page on filter/search
    renderAutomationTable();
}

function handleAutomationSearch() {
    automationSearchQuery = document.getElementById('automationSearch').value;
    updateAutomationFilters();
}

// Search automation records on dashboard
function searchAutomationRecords() {
    const searchInput = document.getElementById('automationSearch');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const tbody = document.getElementById('dashboardAutomationBody');
    if (!tbody || typeof allAutomations === 'undefined') return;

    // Filter records based on search query
    const filtered = allAutomations.filter(item => {
        const searchStr = `${item.excelId} ${item.name} ${item.email} ${item.targetCustomer} ${item.status}`.toLowerCase();
        return searchStr.includes(query);
    });

    // Render filtered results (max 6 for dashboard)
    const records = filtered.slice(0, 6);
    tbody.innerHTML = '';

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center gap-2">
                        <span class="material-symbols-outlined text-slate-300 text-[48px]">search_off</span>
                        <p class="text-sm text-slate-500">No records found matching "${query}"</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    records.forEach(item => {
        let tagClass = 'bg-blue-50 text-blue-600 border-blue-200';
        if (item.targetCustomer === 'High Value') tagClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
        if (item.targetCustomer === 'Enterprise') tagClass = 'bg-purple-50 text-purple-600 border-purple-200';
        if (item.targetCustomer === 'Mid-Market') tagClass = 'bg-amber-50 text-amber-600 border-amber-200';

        let statusClass = 'bg-slate-100 text-slate-600';
        if (item.status === 'Automated') statusClass = 'badge-active text-emerald-600';
        if (item.status === 'Pending') statusClass = 'badge-pending text-amber-600';
        if (item.status === 'Failed') statusClass = 'badge-inactive text-red-600';

        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors';
        row.innerHTML = `
            <td class="px-3 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-500 font-medium">${item.excelId}</td>
            <td class="px-3 sm:px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">${item.name}</td>
            <td class="px-3 sm:px-6 py-3.5 text-xs sm:text-sm text-slate-500 hidden sm:table-cell">${item.email}</td>
            <td class="px-3 sm:px-6 py-3.5 hidden lg:table-cell">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${tagClass} uppercase tracking-wider">${item.targetCustomer}</span>
            </td>
            <td class="px-3 sm:px-6 py-3.5">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClass} uppercase tracking-wider">${item.status}</span>
            </td>
            <td class="px-3 sm:px-6 py-3.5 text-right">
                <button onclick="handleMoreActions(event, '${item.excelId}', 'automation')" class="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                    <span class="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function sortAutomation(column) {
    if (automationSortCol === column) {
        automationSortDir = automationSortDir === 'asc' ? 'desc' : 'asc';
    } else {
        automationSortCol = column;
        automationSortDir = 'asc';
    }
    updateAutomationFilters();
}

function renderAutomationTable() {
    const tbody = document.getElementById('automationTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const start = (automationPage - 1) * automationPageSize;
    const end = start + automationPageSize;
    const pageData = filteredAutomations.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="px-6 py-12 text-center text-slate-500">No records found matching your criteria</td></tr>`;
    }

    pageData.forEach(item => {
        let tagClass = 'bg-blue-50 text-blue-600 border-blue-200';
        if (item.targetCustomer === 'Strategic') tagClass = 'bg-purple-50 text-purple-600 border-purple-200';
        if (item.targetCustomer === 'High Value') tagClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
        if (item.targetCustomer === 'Mid-Market') tagClass = 'bg-amber-50 text-amber-600 border-amber-200';

        let statusClass = 'bg-slate-100 text-slate-600';
        if (item.status === 'Automated') statusClass = 'badge-active text-emerald-600';
        if (item.status === 'Pending') statusClass = 'badge-pending text-amber-600';
        if (item.status === 'Failed') statusClass = 'badge-inactive text-red-600';

        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group';
        row.innerHTML = `
            <td class="px-6 py-4">
                <input type="checkbox" class="excel-row-checkbox w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer" onchange="updateSelectAllCheckbox()">
            </td>
            <td class="px-6 py-4 text-sm text-slate-500 font-medium">${item.excelId}</td>
            <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">${item.name}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${item.email}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${item.phone}</td>
            <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${tagClass} uppercase tracking-wider">
                    ${item.targetCustomer}
                </span>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${statusClass} uppercase tracking-wider">
                    ${item.status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="handleMoreActions(event, '${item.excelId}', 'automation')" class="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                    <span class="material-symbols-outlined text-[18px]">more_horiz</span>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateAutomationPaginationUI();
}

function updateAutomationPaginationUI() {
    const info = document.getElementById('automationPaginationInfo');
    const container = document.getElementById('automationPageNumbers');
    if (!info || !container) return;

    const total = filteredAutomations.length;
    const start = total === 0 ? 0 : (automationPage - 1) * automationPageSize + 1;
    const end = Math.min(automationPage * automationPageSize, total);

    info.textContent = `Showing ${start}-${end} of ${total} records`;

    container.innerHTML = '';
    const totalPages = Math.ceil(total / automationPageSize);

    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 5 && i > 3 && i < totalPages) {
            if (i === 4) {
                const dots = document.createElement('span');
                dots.className = 'px-2 text-slate-400';
                dots.textContent = '...';
                container.appendChild(dots);
            }
            continue;
        }

        const btn = document.createElement('button');
        btn.className = `size-8 rounded-lg text-xs font-bold transition-all ${i === automationPage ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`;
        btn.textContent = i;
        btn.onclick = () => goToAutomationPage(i);
        container.appendChild(btn);
    }
}

function goToAutomationPage(p) {
    automationPage = p;
    renderAutomationTable();
}

function prevAutomationPage() {
    if (automationPage > 1) goToAutomationPage(automationPage - 1);
}

function nextAutomationPage() {
    const totalPages = Math.ceil(filteredAutomations.length / automationPageSize);
    if (automationPage < totalPages) goToAutomationPage(automationPage + 1);
}

function updateAutomationStats() {
    if (!document.getElementById('stat-total')) return;
    document.getElementById('stat-total').textContent = '1,240';
    document.getElementById('stat-validated').textContent = '856';
    document.getElementById('stat-pending').textContent = '384';
    document.getElementById('stat-tagged').textContent = '1,102';
}

function handleAutomate() {
    const selectedCount = document.querySelectorAll('.excel-row-checkbox:checked').length;
    if (selectedCount === 0) {
        showToast('Please select at least one record to automate', 'error');
        return;
    }
    openAutomationModal();
}

function openAutomationModal() {
    const modal = document.getElementById('automationModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeAutomationModal() {
    const modal = document.getElementById('automationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function confirmAutomation() {
    const revision = document.getElementById('automationRevision').value;
    closeAutomationModal();
    showCustomModal({
        title: 'Action Completed',
        message: 'Automation completed successfully.',
        type: 'success',
        confirmText: 'OK'
    });
}


function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.className = `premium-toast fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-[200] animate-slide-up`;

    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    }

    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.classList.remove('animate-fade-out');
        }, 300);
    }, 3000);
}

// Upload Modal Functions
function openUploadModal(id) {
    activeActionId = id; // Store the ID for reference

    // Close the dropdown menu first
    const dropdown = document.getElementById('actionDropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
        dropdown.style.display = 'none';
    }

    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Reset inputs and labels
        resetUploadModal();

        // Add drag and drop functionality
        setupDragAndDrop();
    }
}

function resetUploadModal() {
    // Reset file inputs
    const docInput = document.getElementById('docUploadInput');
    const excelInput = document.getElementById('excelUploadInput');

    if (docInput) {
        docInput.value = '';
        updateUploadLabel('docUploadInput', 'docFileName', 'Choose File (PDF, DOC, Images)');
    }

    if (excelInput) {
        excelInput.value = '';
        updateUploadLabel('excelUploadInput', 'excelFileName', 'Choose Excel File (.xlsx, .csv)');
    }

    // Remove file-selected class from upload zones
    document.querySelectorAll('.upload-zone').forEach(zone => {
        zone.classList.remove('file-selected');
    });
}

function setupDragAndDrop() {
    const uploadZones = document.querySelectorAll('.upload-zone');

    uploadZones.forEach(zone => {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.remove('drag-over');
            });
        });

        zone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            const input = zone.querySelector('input[type="file"]');
            if (input && files.length > 0) {
                input.files = files;
                const changeEvent = new Event('change', { bubbles: true });
                input.dispatchEvent(changeEvent);
            }
        });
    });
}

function updateUploadLabel(inputId, labelId, defaultText) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    const zone = input?.closest('.upload-zone');

    if (input && label) {
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            label.innerHTML = `<span class="text-emerald-600 dark:text-emerald-400 font-semibold">${file.name}</span><br><span class="text-xs text-slate-400">${(file.size / 1024).toFixed(2)} KB</span>`;
            if (zone) zone.classList.add('file-selected');
        } else {
            label.textContent = defaultText;
            if (zone) zone.classList.remove('file-selected');
        }
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.add('animate-fade-out');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('animate-fade-out');
            document.body.style.overflow = 'auto';
            resetUploadModal();
        }, 300);
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    const uploadModal = document.getElementById('uploadModal');
    if (uploadModal) {
        uploadModal.addEventListener('click', function (e) {
            if (e.target === uploadModal) {
                closeUploadModal();
            }
        });
    }
});

function openEditCustomerModal(id) {
    const customer = allCustomers.find(c => c.id === id) ||
        JSON.parse(localStorage.getItem('customers') || '[]').find(c => c.id === id);

    if (!customer) {
        console.warn('Customer not found:', id);
        return;
    }

    document.getElementById('editCustomerId').value = customer.id;
    document.getElementById('editCustomerName').value = customer.name || customer.clientName || '';
    document.getElementById('editCustomerEmail').value = customer.email || customer.emailAddress || '';
    document.getElementById('editCustomerPhone').value = customer.phone || customer.phoneNumber || '';
    document.getElementById('editCustomerStatus').value = customer.status || 'Active';

    const modal = document.getElementById('editCustomerModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeEditCustomerModal() {
    const modal = document.getElementById('editCustomerModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function saveCustomerEdit(event) {
    event.preventDefault();
    const id = document.getElementById('editCustomerId').value;

    // Update in allCustomers array if it exists
    const index = allCustomers.findIndex(c => c.id === id);
    if (index !== -1) {
        allCustomers[index] = {
            ...allCustomers[index],
            name: document.getElementById('editCustomerName').value,
            email: document.getElementById('editCustomerEmail').value,
            phone: document.getElementById('editCustomerPhone').value,
            status: document.getElementById('editCustomerStatus').value
        };
    }

    // Also update in localStorage
    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const localIndex = customers.findIndex(c => c.id === id);
    if (localIndex !== -1) {
        customers[localIndex] = {
            ...customers[localIndex],
            clientName: document.getElementById('editCustomerName').value,
            emailAddress: document.getElementById('editCustomerEmail').value,
            phoneNumber: document.getElementById('editCustomerPhone').value,
            status: document.getElementById('editCustomerStatus').value
        };
        localStorage.setItem('customers', JSON.stringify(customers));
    }

    closeEditCustomerModal();

    // Refresh the tables
    if (typeof filterCustomers === 'function') filterCustomers();
    if (typeof loadCustomers === 'function') loadCustomers();

    showCustomModal({
        title: 'Action Completed',
        message: 'Customer updated successfully.',
        type: 'success',
        confirmText: 'OK'
    });
}

function openEditRecordModal(id) {
    const record = allAutomations.find(r => r.excelId === id);
    if (!record) return;

    document.getElementById('editRecordId').value = record.excelId;
    document.getElementById('editRecordName').value = record.name;
    document.getElementById('editRecordEmail').value = record.email;
    document.getElementById('editRecordPhone').value = record.phone;
    document.getElementById('editRecordTarget').value = record.targetCustomer;
    document.getElementById('editRecordStatus').value = record.status;

    const modal = document.getElementById('editRecordModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeEditRecordModal() {
    const modal = document.getElementById('editRecordModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function saveRecordEdit(event) {
    event.preventDefault();
    const id = document.getElementById('editRecordId').value;
    const index = allAutomations.findIndex(r => r.excelId === id);
    if (index === -1) return;

    allAutomations[index] = {
        ...allAutomations[index],
        name: document.getElementById('editRecordName').value,
        email: document.getElementById('editRecordEmail').value,
        phone: document.getElementById('editRecordPhone').value,
        targetCustomer: document.getElementById('editRecordTarget').value,
        status: document.getElementById('editRecordStatus').value
    };

    closeEditRecordModal();
    updateAutomationFilters();
    showCustomModal({
        title: 'Action Completed',
        message: 'Record updated successfully.',
        type: 'success',
        confirmText: 'OK'
    });
}

function updateFileName(inputId, labelId) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if (input.files.length > 0) {
        label.textContent = input.files[0].name;
        label.classList.add('text-primary', 'font-bold');
    }
}

function handleImport() {
    const docFile = document.getElementById('docUploadInput')?.files[0];
    const excelFile = document.getElementById('excelUploadInput')?.files[0];

    if (!docFile && !excelFile) {
        showCustomModal({
            title: 'No Files Selected',
            message: 'Please select at least one file to upload.',
            type: 'warning',
            confirmText: 'OK'
        });
        return;
    }

    // Show loading state on Import button
    const importBtn = event?.target || document.querySelector('#uploadModal button[onclick*="handleImport"]');
    if (importBtn) {
        importBtn.disabled = true;
        importBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Uploading...';
    }

    // Simulate upload with progress
    setTimeout(() => {
        closeUploadModal();

        // Reset button state
        if (importBtn) {
            importBtn.disabled = false;
            importBtn.innerHTML = '<span class="material-symbols-outlined text-[20px]">upload</span> Import';
        }

        // Show success message with file details
        let message = 'Files uploaded successfully!';
        if (docFile && excelFile) {
            message = `Uploaded: ${docFile.name} and ${excelFile.name}`;
        } else if (docFile) {
            message = `Uploaded: ${docFile.name}`;
        } else if (excelFile) {
            message = `Uploaded: ${excelFile.name}`;
        }

        showCustomModal({
            title: 'Upload Complete',
            message: message,
            type: 'success',
            confirmText: 'OK'
        });

        // If we have the customer/record ID, we could update their document count here
        if (activeActionId) {
            console.log(`Files uploaded for record: ${activeActionId}`);
        }
    }, 1500);
}

// Button Loading Wrapper
async function withLoading(btn, callback) {
    if (!btn) return callback();
    btn.classList.add('btn-loading');
    try {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Fake realistic delay
        await callback();
    } finally {
        btn.classList.remove('btn-loading');
    }
}

// Function to add customer to table
function addCustomerToTable(customer) {
    const isDashboard = document.getElementById('recentCustomersBody') !== null;
    const tbody = isDashboard ? document.getElementById('recentCustomersBody') : document.getElementById('customerTableBody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer';

    const firstLetter = (customer.name || customer.clientName || 'C').charAt(0).toUpperCase();
    const status = customer.status || 'Active';
    const statusClass = status === 'Active' ? 'badge-active' : status === 'Pending' ? 'badge-pending' : status === 'Inactive' ? 'badge-inactive' : 'bg-slate-100 text-slate-600';
    const statusDot = status === 'Active' ? 'bg-emerald-500' : status === 'Pending' ? 'bg-amber-500' : status === 'Inactive' ? 'bg-red-500' : 'bg-slate-400';

    if (isDashboard) {
        // 6 Column Layout for Dashboard
        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-slate-500">${customer.id || '-'}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-semibold text-primary">${firstLetter}</div>
                    <span class="text-sm font-medium text-slate-900 dark:text-white">${customer.name || customer.clientName || '-'}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500 font-medium">${customer.purchaseOrder || 'N/A'}</td>
            <td class="px-6 py-4 text-sm text-slate-400 font-medium">${customer.files || 0} File(s)</td>
            <td class="px-6 py-4">
                <span class="${statusClass} px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center">
                    <span class="size-1.5 rounded-full ${statusDot} mr-1.5"></span> ${status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button class="action-icon text-slate-400 hover:text-primary transition-colors" onclick="handleMoreActions(event, '${customer.id}', 'customer')">
                    <span class="material-symbols-outlined">more_horiz</span>
                </button>
            </td>
        `;
    } else {
        // 8 Column Layout for Directory
        row.innerHTML = `
            <td class="px-6 py-4 text-sm text-slate-500 font-medium">${customer.id || '-'}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">${firstLetter}</div>
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">${customer.name || customer.clientName || '-'}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-slate-500">${customer.email || customer.emailAddress || '-'}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${customer.phone || customer.phoneNumber || '-'}</td>
            <td class="px-6 py-4 text-sm text-slate-400 font-medium">${customer.files || 0} File(s)</td>
            <td class="px-6 py-4 text-sm text-slate-500">${customer.createdDate || customer.timestamp || new Date().toLocaleDateString()}</td>
            <td class="px-6 py-4">
                <span class="${statusClass} px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center">
                    <span class="size-1.5 rounded-full ${statusDot} mr-1.5"></span> ${status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-1">
                    <button class="action-icon text-slate-400 hover:text-primary transition-colors" onclick="handleMoreActions(event, '${customer.id}', 'customer')" title="More Actions">
                        <span class="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                </div>
            </td>
        `;
    }
    tbody.insertBefore(row, tbody.firstChild);
}

// Function to load customers from localStorage
async function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const tbody = document.getElementById('recentCustomersBody');
    if (!tbody) return;

    // Show Loading State
    tbody.innerHTML = `
        <tr class="animate-pulse">
            <td class="px-6 py-4"><div class="skeleton-box w-12"></div></td>
            <td class="px-6 py-4"><div class="flex items-center gap-2"><div class="skeleton-avatar"></div><div class="skeleton-box w-24"></div></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-20"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-16"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-16 h-6 rounded-full"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-8 ml-auto"></div></td>
        </tr>
    `;
    await new Promise(resolve => setTimeout(resolve, 600));

    tbody.innerHTML = '';

    if (customers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12">
                    <div class="empty-state-container">
                        <span class="material-symbols-outlined empty-state-icon">inbox</span>
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white">No recent activity</h3>
                        <p class="text-xs text-slate-500">New customer records will appear here.</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        customers.slice(0, 5).forEach(customer => {
            const firstLetter = customer.clientName ? customer.clientName.charAt(0).toUpperCase() : 'C';

            // Normalize status - treat Suspended as Inactive
            let displayStatus = customer.status;
            if (displayStatus === 'Suspended') displayStatus = 'Inactive';

            const statusClass = displayStatus === 'Active' ? 'badge-active' : displayStatus === 'Pending' ? 'badge-pending' : 'badge-inactive';
            const statusDot = displayStatus === 'Active' ? 'bg-emerald-500' : displayStatus === 'Pending' ? 'bg-amber-500' : 'bg-red-500';

            const row = document.createElement('tr');
            row.className = 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer';
            row.innerHTML = `
                <td class="px-6 py-4 text-sm text-slate-500">${customer.id}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-semibold text-primary">${firstLetter}</div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white">${customer.clientName}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500 font-medium">${customer.purchaseOrder || 'N/A'}</td>
                <td class="px-6 py-4 text-sm text-slate-400 font-medium">${customer.files || 0} File(s)</td>
                <td class="px-6 py-4">
                    <span class="${statusClass} px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center">
                        <span class="size-1.5 rounded-full ${statusDot} mr-1.5"></span> ${displayStatus}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="action-icon text-slate-400 hover:text-primary transition-colors" onclick="handleMoreActions(event, '${customer.id}', 'customer')">
                        <span class="material-symbols-outlined">more_horiz</span>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Function to load automations on dashboard
async function loadDashboardAutomations() {
    // Generate dummy data if not already present
    if (allAutomations.length === 0) generateDummyData();

    const tbody = document.getElementById('dashboardAutomationBody');
    if (!tbody) return;

    // Show Loading State
    tbody.innerHTML = `
        <tr class="animate-pulse">
            <td class="px-6 py-4"><div class="skeleton-box w-16"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-24"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-32"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-20"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-16 h-6 rounded-full"></div></td>
            <td class="px-6 py-4"><div class="skeleton-box w-8 ml-auto"></div></td>
        </tr>
    `;
    await new Promise(resolve => setTimeout(resolve, 600));

    // Render recent automations (max 6)
    searchAutomationRecords();
}

// --- HELPER UI FUNCTIONS ---

function showSkeleton(containerId, columns, rows = itemsPerPage) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let skeletonHtml = '';
    for (let i = 0; i < rows; i++) {
        skeletonHtml += `
            <tr class="animate-pulse border-b border-slate-100 dark:border-slate-800">
                <td class="px-6 py-4"><div class="skeleton-box w-12"></div></td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-box w-32"></div>
                    </div>
                </td>
                <td class="px-6 py-4"><div class="skeleton-box w-40"></div></td>
                <td class="px-6 py-4"><div class="skeleton-box w-24"></div></td>
                <td class="px-6 py-4"><div class="flex gap-1"><div class="skeleton-box w-8"></div><div class="skeleton-box w-8"></div></div></td>
                <td class="px-6 py-4"><div class="skeleton-box w-20"></div></td>
                <td class="px-6 py-4"><div class="skeleton-box w-16 h-6 rounded-full"></div></td>
                <td class="px-6 py-4 text-right"><div class="skeleton-box w-8 ml-auto"></div></td>
            </tr>
        `;
    }
    container.innerHTML = skeletonHtml;
}

function openQuickView(id) {
    const customer = allCustomers.find(c => c.id === id) ||
        JSON.parse(localStorage.getItem('customers') || '[]').find(c => c.id === id);

    if (!customer) return;

    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    // Fill Modal Data
    const initials = (customer.name || customer.clientName || 'CU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('qv-avatar').textContent = initials;
    document.getElementById('qv-name').textContent = customer.name || customer.clientName || '-';
    document.getElementById('qv-id').textContent = `ID: ${customer.id}`;
    document.getElementById('qv-email').textContent = customer.email || customer.emailAddress || '-';
    document.getElementById('qv-phone').textContent = customer.phone || customer.phoneNumber || '-';
    document.getElementById('qv-date').textContent = customer.createdDate || customer.timestamp || '-';

    // Status Badge
    const status = customer.status || 'Active';
    const statusColor = status === 'Active' ? 'text-emerald-500' : status === 'Pending' ? 'text-amber-500' : status === 'Inactive' ? 'text-red-500' : 'text-slate-500';
    document.getElementById('qv-status-container').innerHTML = `
        <span class="glass-badge ${statusColor}">
            <span class="size-2 rounded-full bg-current"></span> ${status}
        </span>
    `;

    // Docs
    const docs = customer.docs || (customer.files ? [`${customer.files} Documents`] : []);
    document.getElementById('qv-docs-container').innerHTML = docs.map(doc => `
        <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-[14px]">description</span> ${doc}
        </span>
    `).join('') || '<span class="text-xs text-slate-400">No documents found</span>';

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Function to open Quick View for Automation records
function openAutomationQuickView(excelId) {
    const automation = allAutomations.find(a => a.excelId === excelId);

    if (!automation) return;

    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    // Fill Modal Data with automation info
    const initials = (automation.name || 'AU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('qv-avatar').textContent = initials;
    document.getElementById('qv-name').textContent = automation.name || '-';
    document.getElementById('qv-id').textContent = `Excel ID: ${automation.excelId}`;
    document.getElementById('qv-email').textContent = automation.email || '-';
    document.getElementById('qv-phone').textContent = automation.phone || '-';
    document.getElementById('qv-date').textContent = automation.uploadDate || '-';

    // Status Badge
    const status = automation.status || 'Pending';
    const statusColor = status === 'Automated' ? 'text-emerald-500' : status === 'Pending' ? 'text-amber-500' : status === 'Failed' ? 'text-red-500' : 'text-slate-500';
    document.getElementById('qv-status-container').innerHTML = `
        <span class="glass-badge ${statusColor}">
            <span class="size-2 rounded-full bg-current"></span> ${status}
        </span>
    `;

    // Target Customer Tag
    const targetTag = automation.targetCustomer || 'Standard';
    let tagClass = 'bg-blue-50 text-blue-600 border-blue-200';
    if (targetTag === 'High Value') tagClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
    if (targetTag === 'Enterprise') tagClass = 'bg-purple-50 text-purple-600 border-purple-200';
    if (targetTag === 'Mid-Market') tagClass = 'bg-amber-50 text-amber-600 border-amber-200';

    document.getElementById('qv-docs-container').innerHTML = `
        <span class="px-3 py-1 ${tagClass} text-xs font-bold rounded-lg border flex items-center gap-2">
            <span class="material-symbols-outlined text-[14px]">label</span> ${targetTag}
        </span>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Function to delete customer
function deleteCustomer(customerId) {
    openDeleteModal(customerId, 'customer');
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
// --- EXPORT FUNCTIONALITY ---

// User Session Management
function initUserSession() {
    const username = localStorage.getItem('loggedInUser');
    const isLoginPage = window.location.pathname.includes('login.html');

    // If no user is logged in and not on login page, redirect to login
    if (!username && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }

    // If user is logged in and on login page, redirect to dashboard
    if (username && isLoginPage) {
        window.location.href = 'index.html';
        return;
    }

    // Update avatar across the page
    if (username && !isLoginPage) {
        updateUserAvatar(username);
    }
}

function updateUserAvatar(username) {
    // Get first letter of username, uppercase
    const initial = username.charAt(0).toUpperCase();

    // Get full name for the avatar URL
    const fullName = username.replace(/\s+/g, '+');

    // Update all avatar elements on the page
    const avatarElements = document.querySelectorAll('[data-user-avatar]');
    avatarElements.forEach(element => {
        // Check if it's an image-based avatar (has background-image style or bg-center class)
        if (element.classList.contains('bg-center') || element.style.backgroundImage) {
            // Image-based avatar using ui-avatars.com API
            element.style.backgroundImage = `url("https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff")`;
            // Ensure it has the proper classes
            if (!element.classList.contains('bg-center')) {
                element.classList.add('bg-center', 'bg-no-repeat', 'aspect-square', 'bg-cover', 'rounded-full', 'border-2', 'border-primary/20', 'shrink-0');
            }
        } else {
            // Text-based avatar (simple initial display)
            element.textContent = initial;
            // Ensure it has the proper classes for text display
            if (!element.classList.contains('flex')) {
                element.className = 'size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm';
            }
        }
    });
}

function getUserInfo() {
    return {
        username: localStorage.getItem('loggedInUser') || 'User',
        email: localStorage.getItem('userEmail') || '',
        initial: (localStorage.getItem('loggedInUser') || 'U').charAt(0).toUpperCase()
    };
}

function clearUserSession() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginTimestamp');
}

// --- EXPORT FUNCTIONALITY ---

function exportCustomers(format = 'csv') {
    // Determine which data to export
    // If we're on the directory page, export filtered results.
    // Otherwise (dashboard), export all customers or from localStorage.
    let dataToExport = [];

    if (typeof filteredCustomers !== 'undefined' && filteredCustomers.length > 0) {
        dataToExport = filteredCustomers;
    } else {
        const stored = JSON.parse(localStorage.getItem('customers') || '[]');
        dataToExport = stored.length > 0 ? stored : allCustomers;
    }

    if (dataToExport.length === 0) {
        showToast('No customer data available to export');
        return;
    }

    showToast(`Preparing ${format.toUpperCase()} export...`);

    if (format === 'csv') {
        // CSV Headers
        const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'PO Number', 'Documents', 'Status', 'Date Created'];
        const csvRows = [headers.join(',')];

        dataToExport.forEach(c => {
            const row = [
                c.id || '-',
                `"${(c.name || c.clientName || '-').replace(/"/g, '""')}"`,
                c.email || c.emailAddress || '-',
                c.phone || c.phoneNumber || '-',
                c.purchaseOrder || '-',
                `"${(Array.isArray(c.docs) ? c.docs.join('; ') : (c.files || '-'))}"`,
                c.status || '-',
                c.createdDate || c.timestamp || '-'
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        downloadFile(csvContent, 'customers.csv', 'text/csv');
    } else if (format === 'excel') {
        // Simple HTML Table for Excel compatibility without libraries
        let excelContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Customers</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
            <body>
                <table border="1">
                    <tr style="background-color: #f1f5f9; font-weight: bold;">
                        <td>ID</td><td>Customer Name</td><td>Email</td><td>Phone</td><td>PO Number</td><td>Documents</td><td>Status</td><td>Date Created</td>
                    </tr>
        `;

        dataToExport.forEach(c => {
            excelContent += `
                <tr>
                    <td>${c.id || '-'}</td>
                    <td>${c.name || c.clientName || '-'}</td>
                    <td>${c.email || c.emailAddress || '-'}</td>
                    <td>${c.phone || c.phoneNumber || '-'}</td>
                    <td>${c.purchaseOrder || '-'}</td>
                    <td>${Array.isArray(c.docs) ? c.docs.join(', ') : (c.files || '-')}</td>
                    <td>${c.status || '-'}</td>
                    <td>${c.createdDate || c.timestamp || '-'}</td>
                </tr>
            `;
        });

        excelContent += '</table></body></html>';
        downloadFile(excelContent, 'customers.xls', 'application/vnd.ms-excel');
    }
}

function downloadFile(content, fileName, mimeType) {
    try {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setTimeout(() => {
            showToast(`Success: ${fileName} downloaded`);
        }, 500);
    } catch (error) {
        console.error('Export failed:', error);
        showToast('Error: Could not generate export file');
    }
}

// Generic Reusable Modal Component
function showCustomModal(options) {
    const {
        title,
        message,
        type = 'success',
        confirmText = 'OK',
        cancelText = 'Cancel',
        onConfirm = null,
        onCancel = null
    } = options;

    let modal = document.getElementById('globalCustomModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'globalCustomModal';
        modal.className = 'premium-modal hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4';
        document.body.appendChild(modal);
    }

    let iconHtml = '';
    let confirmBtnClass = 'bg-primary hover:bg-primary/90 shadow-primary/20';

    if (type === 'success') {
        iconHtml = `<div class="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-emerald-600 text-[28px]">check_circle</span></div>`;
        confirmBtnClass = 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20';
    } else if (type === 'warning' || type === 'confirm' || type === 'delete') {
        iconHtml = `<div class="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-red-600 text-[28px]">warning</span></div>`;
        if (type === 'delete') confirmBtnClass = 'bg-red-600 hover:bg-red-700 shadow-red-600/20';
    } else if (type === 'info') {
        iconHtml = `<div class="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-blue-600 text-[28px]">info</span></div>`;
    }

    const showCancel = type === 'confirm' || type === 'delete' || type === 'warning' || onCancel;

    modal.innerHTML = `
        <div class="premium-modal-content bg-white dark:bg-slate-900 shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-slide-up">
            <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
                <div class="flex items-center gap-4">
                    ${iconHtml}
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white">${title}</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${message}</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-end gap-3 p-6 bg-slate-50 dark:bg-slate-800/50">
                ${showCancel ? `<button id="globalModalCancelBtn" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all">${cancelText}</button>` : ''}
                <button id="globalModalConfirmBtn" class="px-6 py-2.5 rounded-xl text-white font-bold transition-all flex items-center gap-2 shadow-lg ${confirmBtnClass}">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (onCancel) onCancel();
        }
    };

    document.addEventListener('keydown', handleKeydown);

    if (showCancel) {
        document.getElementById('globalModalCancelBtn').onclick = () => {
            closeModal();
            if (onCancel) onCancel();
        };
    }

    document.getElementById('globalModalConfirmBtn').onclick = () => {
        closeModal();
        if (onConfirm) onConfirm();
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
            if (onCancel) onCancel();
        }
    };
}
