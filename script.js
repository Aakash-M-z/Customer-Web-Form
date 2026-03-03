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
    document.getElementById('customerForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
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
        customers.push(formData);
        localStorage.setItem('customers', JSON.stringify(customers));

        // Show toast
        showToast('Customer added successfully!');

        // Close modal
        closeCustomerModal();

        // Optionally refresh table
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
