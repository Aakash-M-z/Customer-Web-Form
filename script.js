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

    document.getElementById('customerForm').addEventListener('submit', function (e) {
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

        // Add to table immediately
        addCustomerToTable(formData);

        // Show toast
        showToast('Customer added successfully!');

        // Close modal
        closeCustomerModal();

        console.log('Customer data saved:', formData);
    });

    // Close modal on outside click
    document.getElementById('customerModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeCustomerModal();
        }
    });

    // Automate Form Submission
    document.getElementById('automateForm').addEventListener('submit', function (e) {
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

    // Close automate modal on outside click
    document.getElementById('automateModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeAutomateModal();
        }
    });

    // Close delete modal on outside click
    document.getElementById('deleteModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });

    // Drag and drop functionality
    const dropZone = document.querySelector('label[for="fileUpload"]');

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
});

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
