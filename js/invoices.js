const addInvoiceBtn = document.getElementById('addInvoiceBtn');
const invoiceModal = document.getElementById('invoiceModal');
const closeModalBtn = document.getElementById('closeModal');
const invoiceForm = document.getElementById('invoiceForm');
const invoiceTableBody = document.getElementById('invoiceTableBody');

const clientSelect = document.getElementById('clientSelect');
const invoiceIdInput = document.getElementById('invoiceId');
const serviceTitleInput = document.getElementById('serviceTitle');
const serviceDescInput = document.getElementById('serviceDesc');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('invoiceDate');
const statusSelect = document.getElementById('status');
const editingInvoiceIdInput = document.getElementById('editingInvoiceId');

let invoices = []; 

function fmt(v) {
  const n = Number(v || 0);
  return `$${n.toFixed(2)}`;
}

function populateClientDropdown() {
  clientSelect.innerHTML = '';
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  if (clients.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'No clients found — add client first';
    opt.disabled = true;
    opt.selected = true;
    clientSelect.appendChild(opt);
    return;
  }
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select client...';
  placeholder.disabled = true;
  placeholder.selected = true;
  clientSelect.appendChild(placeholder);

  clients.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    clientSelect.appendChild(opt);
  });
}

function loadInvoices() {
  const saved = localStorage.getItem('invoices');
  invoices = saved ? JSON.parse(saved) : [];
  renderInvoices();
}


function saveInvoices() {
  localStorage.setItem('invoices', JSON.stringify(invoices));
}

function statusBadge(status) {
  const s = (status || 'Pending');
  if (String(s).toLowerCase() === 'paid') {
    return `<span class="badge badge-paid">Paid</span>`;
  } else {
    return `<span class="badge badge-unpaid">Pending</span>`;
  }
}

const deleteModal = document.getElementById('deleteModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
let invoiceToDeleteId = null;

function renderInvoices() {
  invoiceTableBody.innerHTML = '';
  invoices.forEach(inv => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${inv.id}</td>
      <td>${inv.clientName || ''}</td>
      <td>${inv.service || ''}</td>
      <td>${fmt(inv.amount)}</td>
      <td>${inv.date || ''}</td>
      <td class="status-cell">${statusBadge(inv.status)}</td>
      <td class="actions">
        <button class="mark-btn">${inv.paid ? 'Mark Pending' : 'Mark Paid'}</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;
    invoiceTableBody.appendChild(tr);

 
    const markBtn = tr.querySelector('.mark-btn');
    const editBtn = tr.querySelector('.edit-btn');
    const deleteBtn = tr.querySelector('.delete-btn');

    markBtn.addEventListener('click', () => {
      inv.paid = !inv.paid;
      inv.status = inv.paid ? 'Paid' : 'Pending';
      saveInvoices();
      renderInvoices();
    });

    editBtn.addEventListener('click', () => {
      openEditModal(inv.id);
    });

    deleteBtn.addEventListener('click', () => {
      invoiceToDeleteId = inv.id;
      deleteModal.style.display = 'block';
    });
  });
}

if (closeDeleteModal) {
  closeDeleteModal.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });
}
if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });
}
if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener('click', () => {
    invoices = invoices.filter(i => i.id !== invoiceToDeleteId);
    saveInvoices();
    renderInvoices();
    deleteModal.style.display = 'none';
  });
}


addInvoiceBtn.addEventListener('click', () => {
  populateClientDropdown();
  invoiceForm.reset();
  editingInvoiceIdInput.value = '';
  invoiceModal.style.display = 'flex';
  document.getElementById('modalTitle').textContent = 'Add New Invoice';
});

closeModalBtn.addEventListener('click', () => {
  invoiceModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
  if (event.target === invoiceModal) {
    invoiceModal.style.display = 'none';
  }
  if (event.target === deleteModal) {
    deleteModal.style.display = 'none';
  }
});

invoiceForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const idInput = invoiceIdInput.value.trim();
  const clientId = clientSelect.value;
  const clientName = clientSelect.options[clientSelect.selectedIndex]?.text || '';
  const service = serviceTitleInput.value.trim();
  const description = serviceDescInput.value.trim();
  const amount = parseFloat(amountInput.value) || 0;
  const date = dateInput.value;
  const status = statusSelect.value || 'Pending';
  const paid = status.toLowerCase() === 'paid';


  if (!clientId) {
    alert('Please select a client (or add one first).');
    return;
  }
  if (!service) {
    alert('Please enter a service title.');
    return;
  }

  const editingId = editingInvoiceIdInput.value;
  if (editingId) {
    const idx = invoices.findIndex(i => String(i.id) === String(editingId));
    if (idx > -1) {
      invoices[idx] = {
        ...invoices[idx],
        id: idInput || invoices[idx].id,
        clientId,
        clientName,
        service,
        description,
        amount,
        date,
        status,
        paid
      };
    }
  } else {
    // new invoice: if user didn't provide ID, generate one
    const newId = idInput || `INV-${Date.now().toString().slice(-6)}`;
    const newInvoice = {
      id: newId,
      clientId,
      clientName,
      service,
      description,
      amount,
      date,
      status,
      paid
    };
    invoices.push(newInvoice);
  }

  saveInvoices();
  renderInvoices();
  invoiceForm.reset();
  invoiceModal.style.display = 'none';
});

function openEditModal(id) {
  const inv = invoices.find(i => String(i.id) === String(id));
  if (!inv) return;
  populateClientDropdown();

  invoiceIdInput.value = inv.id;
 
  setTimeout(() => {

    const opt = clientSelect.querySelector(`option[value="${inv.clientId}"]`);
    if (opt) opt.selected = true;
  }, 0);
  serviceTitleInput.value = inv.service || '';
  serviceDescInput.value = inv.description || '';
  amountInput.value = Number(inv.amount || 0);
  dateInput.value = inv.date || '';
  statusSelect.value = inv.status || 'Pending';
  editingInvoiceIdInput.value = inv.id;
  document.getElementById('modalTitle').textContent = 'Edit Invoice';
  invoiceModal.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  populateClientDropdown();
  loadInvoices();
});
