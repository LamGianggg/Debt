// ==============================================================
// CACTUS PRACTICE - STRIPE DASHBOARD APPLICATION SCRIPT
// ==============================================================

// State Management
let currentView = 'payments'; // Default to Payments as highlighted in the user's screenshot
let currentCustomerSubView = 'detail';
let isTestDataMode = false;
let isMetadataOpen = false;
let isShowMoreOpen = false;
let currentAvailableBalance = 42850.00;
let totalCustomersCount = 1482;
let totalClinicsCount = 24;
let activePaymentId = 'ch_3N9281h192aa';

// Payment records store for detail modal
const paymentRecords = {
  'ch_3N9281h192aa': {
    id: 'ch_3N9281h192aa',
    amount: '$9.93 USD',
    gross: '$9.93 USD',
    fee: '-$0.59 USD',
    net: '$9.34 USD',
    status: 'Succeeded ✓',
    statusClass: 'bg-[#DEF7EC] text-[#03543F]',
    customer: 'Jane Diaz',
    method: 'Visa •••• 4242',
    date: 'Sep 14, 2026, 11:14:02 PM',
    rawAmount: 9.93
  },
  'ch_3N9188x772bb': {
    id: 'ch_3N9188x772bb',
    amount: '$29.00 USD',
    gross: '$29.00 USD',
    fee: '-$1.14 USD',
    net: '$27.86 USD',
    status: 'Succeeded ✓',
    statusClass: 'bg-[#DEF7EC] text-[#03543F]',
    customer: 'Alexander Hamilton',
    method: 'Mastercard •••• 1092',
    date: 'Sep 14, 2026, 8:30:15 AM',
    rawAmount: 29.00
  },
  'ch_3N8991k441cc': {
    id: 'ch_3N8991k441cc',
    amount: '$99.00 USD',
    gross: '$99.00 USD',
    fee: '-$3.17 USD',
    net: '$95.83 USD',
    status: 'Succeeded ✓',
    statusClass: 'bg-[#DEF7EC] text-[#03543F]',
    customer: 'Sophia Lee',
    method: 'Amex •••• 3004',
    date: 'Sep 13, 2026, 3:15:40 PM',
    rawAmount: 99.00
  },
  'ch_3N8772m119dd': {
    id: 'ch_3N8772m119dd',
    amount: '$2.00 USD',
    gross: '$2.00 USD',
    fee: '-$0.36 USD',
    net: '$1.64 USD',
    status: 'Succeeded ✓',
    statusClass: 'bg-[#DEF7EC] text-[#03543F]',
    customer: 'Jane Diaz',
    method: 'Visa •••• 4242',
    date: 'Sep 13, 2026, 1:05:22 AM',
    rawAmount: 2.00
  },
  'ch_3N8660p220ee': {
    id: 'ch_3N8660p220ee',
    amount: '$150.00 USD',
    gross: '$150.00 USD',
    fee: '-$4.65 USD',
    net: '$145.35 USD',
    status: 'Succeeded ✓',
    statusClass: 'bg-[#DEF7EC] text-[#03543F]',
    customer: 'David Miller',
    method: 'Discover •••• 5511',
    date: 'Sep 12, 2026, 10:00:00 AM',
    rawAmount: 150.00
  },
  'ch_3N8559r881ff': {
    id: 'ch_3N8559r881ff',
    amount: '$19.99 USD',
    gross: '$19.99 USD',
    fee: '$0.00 USD',
    net: '$0.00 USD',
    status: 'Refunded ↶',
    statusClass: 'bg-slate-100 text-slate-700',
    customer: 'Emma Wilson',
    method: 'Visa •••• 9921',
    date: 'Sep 10, 2026, 4:22:18 PM',
    rawAmount: 19.99
  },
  'ch_3N8443t992gg': {
    id: 'ch_3N8443t992gg',
    amount: '$45.00 USD',
    gross: '$45.00 USD',
    fee: '$0.00 USD',
    net: '$0.00 USD',
    status: 'Failed ✕ (Card Declined)',
    statusClass: 'bg-red-100 text-red-700',
    customer: 'Liam Nguyen',
    method: 'Visa •••• 8820',
    date: 'Sep 08, 2026, 2:10:05 PM',
    rawAmount: 45.00
  },
  'ch_3N8331w003hh': {
    id: 'ch_3N8331w003hh',
    amount: '$12.50 USD',
    gross: '$12.50 USD',
    fee: '-$0.66 USD',
    net: '$11.84 USD',
    status: 'Disputed ⚠️',
    statusClass: 'bg-amber-100 text-amber-800',
    customer: 'Sarah Jenkins',
    method: 'Visa •••• 3110',
    date: 'Sep 01, 2026, 9:45:12 AM',
    rawAmount: 12.50
  },
  'ch_3N8001p442zz': {
    id: 'ch_3N8001p442zz',
    amount: '$9.99 USD',
    gross: '$9.99 USD',
    fee: '-$0.59 USD',
    net: '$9.40 USD',
    status: 'Succeeded ✓',
    statusClass: 'bg-[#DEF7EC] text-[#03543F]',
    customer: 'Jane Diaz',
    method: 'Visa •••• 4242',
    date: 'Aug 14, 2026, 11:14:00 PM',
    rawAmount: 9.99
  }
};

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  switchView('payments'); // Open Payments by default matching screenshot
});

// View Switching Function
function switchView(viewName) {
  // Hide all view panels
  const panels = document.querySelectorAll('.view-panel');
  panels.forEach(panel => panel.classList.add('hidden'));

  // Normalize subview target
  let targetId = `view-${viewName}`;
  const subNavBar = document.getElementById('customerSubNavBar');

  if (viewName === 'customers' || viewName === 'customer-detail' || viewName === 'all-customers' || viewName === 'subscriptions' || viewName === 'invoices') {
    if (subNavBar) subNavBar.classList.remove('hidden');
    if (viewName === 'customers') {
      targetId = currentCustomerSubView === 'detail' ? 'view-customer-detail' : `view-${currentCustomerSubView}`;
    }
  } else {
    if (subNavBar) subNavBar.classList.add('hidden');
  }

  const target = document.getElementById(targetId);
  if (target) {
    target.classList.remove('hidden');
    currentView = viewName;
  } else {
    const defaultPanel = document.getElementById('view-payments');
    if (defaultPanel) defaultPanel.classList.remove('hidden');
  }

  // Update Nav highlighting (matches user screenshot exactly)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('nav-active');
  });

  let mainNavId = `nav-${viewName}`;
  if (['customer-detail', 'all-customers', 'subscriptions', 'invoices'].includes(viewName)) {
    mainNavId = 'nav-customers';
  }

  const activeNav = document.getElementById(mainNavId);
  if (activeNav) {
    activeNav.classList.add('nav-active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Customer Sub-View Switching (Detail, All, Subs, Invoices)
function switchCustomerSubView(sub) {
  currentCustomerSubView = sub;
  
  // Hide customer sub-views
  ['view-customer-detail', 'view-all-customers', 'view-subscriptions', 'view-invoices'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Reset tab active styles
  ['tab-cust-detail', 'tab-cust-all', 'tab-cust-subs', 'tab-cust-invoices'].forEach(id => {
    const tab = document.getElementById(id);
    if (tab) {
      tab.classList.remove('subnav-active');
      tab.classList.add('text-slate-500');
    }
  });

  if (sub === 'detail') {
    document.getElementById('view-customer-detail')?.classList.remove('hidden');
    const tab = document.getElementById('tab-cust-detail');
    if (tab) { tab.classList.add('subnav-active'); tab.classList.remove('text-slate-500'); }
  } else if (sub === 'all') {
    document.getElementById('view-all-customers')?.classList.remove('hidden');
    const tab = document.getElementById('tab-cust-all');
    if (tab) { tab.classList.add('subnav-active'); tab.classList.remove('text-slate-500'); }
  } else if (sub === 'subs') {
    document.getElementById('view-subscriptions')?.classList.remove('hidden');
    const tab = document.getElementById('tab-cust-subs');
    if (tab) { tab.classList.add('subnav-active'); tab.classList.remove('text-slate-500'); }
  } else if (sub === 'invoices') {
    document.getElementById('view-invoices')?.classList.remove('hidden');
    const tab = document.getElementById('tab-cust-invoices');
    if (tab) { tab.classList.add('subnav-active'); tab.classList.remove('text-slate-500'); }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Payments Table Filtering (All, Succeeded, Refunded, Failed, Disputed)
function filterPayments(status) {
  // Update button active states
  ['all', 'succeeded', 'refunded', 'failed', 'disputed'].forEach(s => {
    const btn = document.getElementById(`btn-pay-${s}`);
    if (btn) {
      if (s === status) {
        btn.classList.add('bg-slate-100', 'font-semibold', 'text-slate-900');
        btn.classList.remove('text-slate-500');
      } else {
        btn.classList.remove('bg-slate-100', 'font-semibold', 'text-slate-900');
        btn.classList.add('text-slate-500');
      }
    }
  });

  const rows = document.querySelectorAll('#paymentsTableBody tr');
  rows.forEach(row => {
    const rowStatus = row.getAttribute('data-status');
    if (status === 'all' || rowStatus === status) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// Payments Search
function searchPayments(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#paymentsTableBody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    if (!q || text.includes(q)) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// Payment Details Modal Drawer
function openPaymentDetail(paymentId) {
  const rec = paymentRecords[paymentId];
  if (!rec) return;

  activePaymentId = paymentId;
  document.getElementById('det-pay-amount').textContent = rec.amount;
  document.getElementById('det-pay-id').textContent = rec.id;
  document.getElementById('det-pay-customer').textContent = rec.customer;
  document.getElementById('det-pay-method').textContent = rec.method;
  document.getElementById('det-pay-date').textContent = rec.date;
  document.getElementById('det-pay-gross').textContent = rec.gross;
  document.getElementById('det-pay-fee').textContent = rec.fee;
  document.getElementById('det-pay-net').textContent = rec.net;

  const statusEl = document.getElementById('det-pay-status');
  statusEl.textContent = rec.status;
  statusEl.className = `px-2 py-0.5 rounded-full font-semibold ${rec.statusClass}`;

  openModal('modal-payment-detail');
}

function refundPayment(paymentId, amount) {
  if (confirm(`Refund payment of $${amount.toFixed(2)} USD for ${paymentId}?`)) {
    if (paymentRecords[paymentId]) {
      paymentRecords[paymentId].status = 'Refunded ↶';
      paymentRecords[paymentId].statusClass = 'bg-slate-100 text-slate-700';
    }
    const rows = document.querySelectorAll('#paymentsTableBody tr');
    rows.forEach(row => {
      if (row.innerHTML.includes(paymentId) || row.innerHTML.includes(`$${amount.toFixed(2)}`)) {
        row.setAttribute('data-status', 'refunded');
        const badge = row.querySelector('span');
        if (badge) {
          badge.textContent = 'Refunded ↶';
          badge.className = 'px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600';
        }
      }
    });
    showToast(`Refund of $${amount.toFixed(2)} issued successfully!`);
  }
}

function refundActivePayment() {
  closeModal('modal-payment-detail');
  const rec = paymentRecords[activePaymentId];
  if (rec) {
    refundPayment(activePaymentId, rec.rawAmount);
  }
}

// Create Payment Form Submit
function handleCreatePayment(e) {
  e.preventDefault();
  const customer = document.getElementById('newPayCust').value;
  const amount = parseFloat(document.getElementById('newPayAmount').value).toFixed(2);
  const desc = document.getElementById('newPayDesc').value;
  const method = document.getElementById('newPayMethod').value;
  const newId = `ch_3N${Math.floor(100000 + Math.random() * 900000)}pay`;

  const newRow = document.createElement('tr');
  newRow.setAttribute('data-status', 'succeeded');
  newRow.className = 'hover:bg-slate-50 cursor-pointer transition';
  newRow.onclick = () => openPaymentDetail(newId);
  newRow.innerHTML = `
    <td class="py-3.5 px-4 font-semibold text-slate-900">$${amount} USD</td>
    <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DEF7EC] text-[#03543F]">Succeeded ✓</span></td>
    <td class="py-3.5 px-4 text-slate-600">${desc}</td>
    <td class="py-3.5 px-4 font-medium text-indigo-600">${customer}</td>
    <td class="py-3.5 px-4 text-slate-500">${method}</td>
    <td class="py-3.5 px-4 text-slate-500">Just now</td>
    <td class="py-3.5 px-4 text-right" onclick="event.stopPropagation()">
      <button onclick="refundPayment('${newId}', ${amount})" class="text-slate-400 hover:text-slate-700 font-medium">Refund</button>
    </td>
  `;

  const tbody = document.getElementById('paymentsTableBody');
  if (tbody) tbody.prepend(newRow);

  // Register in memory
  paymentRecords[newId] = {
    id: newId,
    amount: `$${amount} USD`,
    gross: `$${amount} USD`,
    fee: `-$${(amount * 0.029 + 0.30).toFixed(2)} USD`,
    net: `$${(amount - (amount * 0.029 + 0.30)).toFixed(2)} USD`,
    status: 'Succeeded ✓',
    statusClass: 'bg-[#DEF7EC] text-[#03543F]',
    customer: customer,
    method: method,
    date: 'Just now',
    rawAmount: parseFloat(amount)
  };

  closeModal('modal-create-payment');
  showToast(`Payment of $${amount} USD charged successfully to ${customer}!`);
}

// Handle Payout Submit
function handlePayoutSubmit(e) {
  e.preventDefault();
  const amtInput = document.getElementById('payoutInputAmount');
  const amount = parseFloat(amtInput.value);

  if (amount <= 0 || amount > currentAvailableBalance) {
    alert('Please enter a valid amount within your available balance.');
    return;
  }

  currentAvailableBalance -= amount;
  document.getElementById('bal-available-num').textContent = `$${currentAvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;
  document.getElementById('payoutAvailMax').textContent = `$${currentAvailableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;

  const newPoId = `po_1O${Math.floor(100000 + Math.random() * 900000)}`;
  const tbody = document.getElementById('payoutsTableBody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3.5 px-4 font-mono text-slate-800">${newPoId}</td>
      <td class="py-3.5 px-4 font-semibold text-slate-900">$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</td>
      <td class="py-3.5 px-4">Chase Bank •••• 9812</td>
      <td class="py-3.5 px-4 text-slate-500">Today</td>
      <td class="py-3.5 px-4 text-slate-500">Tomorrow</td>
      <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DEF7EC] text-[#03543F]">In transit</span></td>
    `;
    tbody.prepend(tr);
  }

  closeModal('modal-payout');
  showToast(`Payout of $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} initiated to Chase Bank!`);
}

// Handle Add Connected Account Submit
function handleAddConnectedSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newConnName').value;
  const country = document.getElementById('newConnCountry').value;
  const newId = `acct_1N${Math.floor(1000 + Math.random() * 9000)}Clinic`;

  totalClinicsCount += 1;
  document.getElementById('conn-total-count').textContent = `${totalClinicsCount} clinics`;

  const tbody = document.getElementById('connectedTableBody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3.5 px-4 font-semibold text-slate-900">${name}</td>
      <td class="py-3.5 px-4 font-mono text-slate-500">${newId}</td>
      <td class="py-3.5 px-4">${country}</td>
      <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DEF7EC] text-[#03543F]">Enabled</span></td>
      <td class="py-3.5 px-4 font-semibold text-slate-900">$0.00</td>
      <td class="py-3.5 px-4 text-right text-indigo-600 hover:underline cursor-pointer" onclick="showToast('Viewing ${name} transfers...')">View dashboard →</td>
    `;
    tbody.prepend(tr);
  }

  closeModal('modal-connected-account');
  showToast(`Connected account created for ${name}!`);
}

// Handle Add Product Submit
function handleAddProductSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newProdName').value;
  const price = parseFloat(document.getElementById('newProdPrice').value).toFixed(2);
  const interval = document.getElementById('newProdInterval').value;
  const desc = document.getElementById('newProdDesc').value || 'Comprehensive healthcare tier.';

  const grid = document.getElementById('productsGrid');
  if (grid) {
    const card = document.createElement('div');
    card.className = 'p-6 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">${name.charAt(0)}</span>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DEF7EC] text-[#03543F]">Active</span>
        </div>
        <h3 class="text-base font-semibold text-slate-900">${name}</h3>
        <p class="text-xs text-slate-500 mt-1">${desc}</p>
        <div class="text-2xl font-bold text-slate-900 mt-4">$${price} <span class="text-xs text-slate-400 font-normal">${interval}</span></div>
      </div>
      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span class="text-slate-500">0 active subscribers</span>
        <button onclick="showToast('Editing ${name}...')" class="text-indigo-600 font-medium hover:underline">Edit pricing →</button>
      </div>
    `;
    grid.prepend(card);
  }

  closeModal('modal-add-product');
  showToast(`Product ${name} added to catalog!`);
}

// Handle Add Customer Submit
function handleNewCustomerSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('newCustName').value;
  const email = document.getElementById('newCustEmail').value;
  const plan = document.getElementById('newCustPlan').value;

  totalCustomersCount += 1;
  document.getElementById('stat-total-cust').textContent = totalCustomersCount.toLocaleString('en-US');

  const tbody = document.getElementById('allCustomersTableBody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 cursor-pointer transition';
    tr.onclick = () => switchCustomerSubView('detail');
    tr.innerHTML = `
      <td class="py-3.5 px-4">
        <div class="font-semibold text-slate-900">${name}</div>
        <div class="text-slate-500">${email}</div>
      </td>
      <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DEF7EC] text-[#03543F]">Active</span></td>
      <td class="py-3.5 px-4 font-semibold text-slate-900">$0.00</td>
      <td class="py-3.5 px-4 font-semibold text-slate-900">${plan.includes('$9.99') ? '$9.99' : (plan.includes('$29') ? '$29.00' : '$99.00')}</td>
      <td class="py-3.5 px-4 text-slate-500">Just now</td>
      <td class="py-3.5 px-4 text-right text-indigo-600 font-medium hover:underline">View details →</td>
    `;
    tbody.prepend(tr);
  }

  closeModal('modal-new-customer');
  showToast(`Customer ${name} registered!`);
}

// Edit Jane Diaz Customer Details
function handleEditDetailsSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('editCustName').value;
  const email = document.getElementById('editCustEmail').value;
  const phone = document.getElementById('editCustPhone').value;
  const addr = document.getElementById('editCustAddress').value;

  document.getElementById('cust-name-header').textContent = name;
  document.getElementById('cust-email-header').textContent = email;
  document.getElementById('cust-field-name').textContent = name;
  document.getElementById('cust-field-email').textContent = email;
  document.getElementById('cust-field-billing-email').textContent = email;
  document.getElementById('cust-field-phone').textContent = phone;
  document.getElementById('cust-field-address').innerHTML = addr.replace(/\n/g, '<br>');

  closeModal('modal-edit-details');
  showToast('Customer information updated successfully!');
}

// Handle Invoice Submit
function handleInvoiceSubmit(e) {
  e.preventDefault();
  const cust = document.getElementById('invCustSelect').value;
  const desc = document.getElementById('invItemDesc').value;
  const amount = parseFloat(document.getElementById('invAmount').value).toFixed(2);
  const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const tbody = document.getElementById('invoicesTableBody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50';
    tr.innerHTML = `
      <td class="py-3.5 px-4 font-mono font-medium text-slate-900">${invNum}</td>
      <td class="py-3.5 px-4 text-indigo-600 font-medium cursor-pointer" onclick="switchCustomerSubView('detail')">${cust}</td>
      <td class="py-3.5 px-4 font-semibold text-slate-900">$${amount} USD</td>
      <td class="py-3.5 px-4 text-slate-500">Oct 30, 2026</td>
      <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#DEF7EC] text-[#03543F]">Paid ✓</span></td>
      <td class="py-3.5 px-4 text-right"><button onclick="downloadReport('invoice')" class="text-indigo-600 hover:underline">PDF ↓</button></td>
    `;
    tbody.prepend(tr);
  }

  closeModal('modal-invoice');
  showToast(`Invoice ${invNum} generated and sent to ${cust}!`);
}

// Adjust Credit Balance
function saveAdjustBalance() {
  const amtInput = document.getElementById('adjBalAmount');
  const val = parseFloat(amtInput?.value || 0);
  const balanceEl = document.getElementById('janeCreditBalance');
  if (balanceEl && val) {
    balanceEl.textContent = `$${val.toFixed(2)} USD`;
  }
  closeModal('modal-balance');
  showToast('Customer credit balance updated!');
}

// Timeframe selector on Home
function setTimeframe(period) {
  ['today', '7d', '30d', '12m'].forEach(p => {
    const btn = document.getElementById(`tf-${p}`);
    if (btn) {
      if (p === period) {
        btn.classList.add('bg-white', 'shadow-sm', 'text-slate-900', 'font-semibold');
      } else {
        btn.classList.remove('bg-white', 'shadow-sm', 'text-slate-900', 'font-semibold');
      }
    }
  });

  const gross = document.getElementById('kpi-gross');
  const net = document.getElementById('kpi-net');
  const badge = document.getElementById('chart-avg-badge');

  if (period === 'today') {
    gross.textContent = '$5,420.00';
    net.textContent = '$4,850.00';
    badge.textContent = 'Today volume';
  } else if (period === '7d') {
    gross.textContent = '$32,150.00';
    net.textContent = '$24,800.00';
    badge.textContent = 'Avg $4,592 / day';
  } else if (period === '30d') {
    gross.textContent = '$128,490.00';
    net.textContent = '$96,210.00';
    badge.textContent = 'Avg $4,283 / day';
  } else if (period === '12m') {
    gross.textContent = '$1,420,800.00';
    net.textContent = '$1,180,000.00';
    badge.textContent = 'Avg $118,400 / month';
  }
  showToast(`Updated view to ${period} metrics`);
}

// Filter All Customers in Directory
function filterCustomers(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#allCustomersTableBody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    if (!q || text.includes(q)) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

// Real File Download Simulation via CSV Blob
function triggerCsvDownload(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}

function downloadReport(type) {
  if (type === 'revenue') {
    const csv = `Date,Transaction_ID,Customer,Product,Gross_USD,Fees_USD,Net_USD
2026-09-14,ch_3N9281h192aa,Jane Diaz,Premium Plan,9.93,0.59,9.34
2026-09-14,ch_3N9188x772bb,Alexander Hamilton,Pro Care Plan,29.00,1.14,27.86
2026-09-13,ch_3N8991k441cc,Sophia Lee,Enterprise Health Suite,99.00,3.17,95.83
2026-09-13,ch_3N8772m119dd,Jane Diaz,Subscription update,2.00,0.36,1.64
2026-09-12,ch_3N8660p220ee,David Miller,Annual Comprehensive Lab Workup,150.00,4.65,145.35`;
    triggerCsvDownload('Monthly_Revenue_Recognition_Sep2026.csv', csv);
  } else if (type === 'payouts') {
    const csv = `Payout_ID,Initiated,Estimated_Arrival,Amount_USD,Destination,Status
po_1O83Ab991122,2026-10-18,2026-10-19,18420.00,Chase Bank •••• 9812,Paid
po_1O79Zx883344,2026-10-17,2026-10-18,14190.50,Chase Bank •••• 9812,Paid
po_1O65Kk772211,2026-10-16,2026-10-17,10239.50,Chase Bank •••• 9812,Paid`;
    triggerCsvDownload('Payout_Reconciliation_Q3_2026.csv', csv);
  } else if (type === 'tax') {
    const csv = `Jurisdiction,Taxable_Sales_USD,Exempt_Sales_USD,Tax_Collected_USD
California,148200.00,24000.00,10744.50
New York,82100.00,12000.00,7224.80
Texas,64500.00,8500.00,5321.25`;
    triggerCsvDownload('Tax_Liability_YTD2026.csv', csv);
  } else if (type === 'financial') {
    const csv = `Period,Gross_Volume_USD,Net_Revenue_USD,Processing_Fees_USD,Refunds_USD,Disputes_USD
2026-Q3,384120.00,358100.00,11139.48,1420.00,12.50
2026-Q2,342000.00,319080.00,9918.00,890.00,0.00
2026-Q1,310500.00,289700.00,9004.50,1100.00,0.00`;
    triggerCsvDownload('Financial_Summary_Report_2026.csv', csv);
  } else if (type === 'invoice') {
    showToast('Downloading invoice PDF...');
  }
}

function exportPaymentsCSV() {
  downloadReport('revenue');
}

function exportCustomersCSV() {
  const csv = `Customer_ID,Name,Email,Status,MRR_USD,Total_Spent_USD,Created_Date
cus_Hwy555rNEuVeTp,Jane Diaz,jane.diaz@example.com,Active,9.99,635.93,2020-08-14
cus_AlexH9912001,Alexander Hamilton,alex.h@treasury.gov,Active,29.00,1240.00,2020-07-22
cus_SophiaLee8812,Sophia Lee,sophia.lee@acme.co,Active,99.00,4190.50,2020-05-04
cus_LiamNg771234,Liam Nguyen,liam.nguyen@techflow.io,Active,9.99,89.00,2020-09-02
cus_EmmaWils6610,Emma Wilson,emma.wilson@cloudops.com,Active,19.99,540.20,2020-09-10`;
  triggerCsvDownload('customers_export_2026.csv', csv);
}

// Global Search
function handleSearch(query) {
  if (!query) return;
  const q = query.toLowerCase();
  if (q.includes('jane') || q.includes('hwy')) {
    switchView('customer-detail');
  } else if (q.includes('pay') || q.includes('charge')) {
    switchView('payments');
  } else if (q.includes('bal') || q.includes('payout')) {
    switchView('balances');
  } else if (q.includes('conn') || q.includes('clinic')) {
    switchView('connected');
  } else if (q.includes('prod') || q.includes('price')) {
    switchView('products');
  } else if (q.includes('rep') || q.includes('tax')) {
    switchView('reports');
  } else if (q.includes('cust')) {
    switchView('all-customers');
  }
}

// Modals Helper
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
  const dropdown = document.getElementById('actionsDropdown');
  if (dropdown) dropdown.classList.add('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

// Actions Menu Dropdown
function toggleActionsMenu() {
  const dropdown = document.getElementById('actionsDropdown');
  if (dropdown) dropdown.classList.toggle('hidden');
}

window.addEventListener('click', (e) => {
  const dropdown = document.getElementById('actionsDropdown');
  if (dropdown && !e.target.closest('#actionsDropdown') && !e.target.closest('button[onclick="toggleActionsMenu()"]')) {
    dropdown.classList.add('hidden');
  }
});

// Show More / Show Less Collapsible in Customer Details
function toggleShowMore() {
  const box = document.getElementById('moreDetailsBox');
  const btn = document.getElementById('btnShowMore');
  if (!box || !btn) return;

  isShowMoreOpen = !isShowMoreOpen;
  if (isShowMoreOpen) {
    box.classList.remove('hidden');
    btn.textContent = 'Show less';
  } else {
    box.classList.add('hidden');
    btn.textContent = 'Show more';
  }
}

// Metadata Accordion in Customer Details
function toggleMetadata() {
  const content = document.getElementById('metadataContent');
  const chevron = document.getElementById('meta-chevron');
  if (!content || !chevron) return;

  isMetadataOpen = !isMetadataOpen;
  if (isMetadataOpen) {
    content.classList.remove('hidden');
    chevron.textContent = '▾';
  } else {
    content.classList.add('hidden');
    chevron.textContent = '▸';
  }
}

// Events & Logs Tab Switcher in Jane Diaz Detail
function toggleCustomerLogs(showLogs) {
  const overview = document.getElementById('custOverviewSection');
  const logs = document.getElementById('custLogsSection');
  const btnOverview = document.getElementById('btnCustTabOverview');
  const btnLogs = document.getElementById('btnCustTabLogs');

  if (showLogs) {
    overview?.classList.add('hidden');
    logs?.classList.remove('hidden');
    btnOverview?.classList.remove('text-[#635BFF]', 'border-b-2', 'border-[#635BFF]', 'font-semibold');
    btnOverview?.classList.add('text-slate-500', 'font-normal');
    btnLogs?.classList.add('text-[#635BFF]', 'border-b-2', 'border-[#635BFF]', 'font-semibold');
    btnLogs?.classList.remove('text-slate-500', 'font-normal');
  } else {
    overview?.classList.remove('hidden');
    logs?.classList.add('hidden');
    btnLogs?.classList.remove('text-[#635BFF]', 'border-b-2', 'border-[#635BFF]', 'font-semibold');
    btnLogs?.classList.add('text-slate-500', 'font-normal');
    btnOverview?.classList.add('text-[#635BFF]', 'border-b-2', 'border-[#635BFF]', 'font-semibold');
    btnOverview?.classList.remove('text-slate-500', 'font-normal');
  }
}

// Test Mode Toggle
function toggleTestData(forcedState = null) {
  if (forcedState !== null) {
    isTestDataMode = forcedState;
  } else {
    isTestDataMode = !isTestDataMode;
  }

  const knob = document.getElementById('testDataKnob');
  const toggle = document.getElementById('testDataToggle');
  const banner = document.getElementById('testModeBanner');

  if (isTestDataMode) {
    toggle?.classList.remove('bg-slate-300');
    toggle?.classList.add('bg-[#635BFF]');
    knob?.classList.remove('translate-x-0');
    knob?.classList.add('translate-x-3.5');
    banner?.classList.remove('hidden');
    showToast('Switched to Test Data mode');
  } else {
    toggle?.classList.remove('bg-[#635BFF]');
    toggle?.classList.add('bg-slate-300');
    knob?.classList.remove('translate-x-3.5');
    knob?.classList.add('translate-x-0');
    banner?.classList.add('hidden');
    showToast('Switched to Live mode');
  }
}

// Copy to Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${text} to clipboard!`);
  }).catch(() => {
    showToast('Copied to clipboard');
  });
}

// Toast Notifications
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('hidden');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Customer Specific Actions
function createSubSuccess() {
  closeModal('modal-subscription');
  showToast('Subscription created for Jane Diaz!');
}

function confirmCancelSub() {
  if (confirm('Are you sure you want to cancel the Premium Plan subscription for Jane Diaz?')) {
    showToast('Subscription will cancel at end of billing period (Oct 14)');
  }
}

function deletePaymentMethod() {
  if (confirm('Are you sure you want to remove Visa •••• 4242?')) {
    showToast('Payment method removed');
  }
}

function deleteCustomer() {
  if (confirm('Permanently delete customer Jane Diaz? This action cannot be undone.')) {
    showToast('Customer deleted');
    switchCustomerSubView('all');
  }
}

function toggleRevealSK() {
  const input = document.getElementById('skInput');
  const btn = document.getElementById('btnRevealSK');
  if (!input || !btn) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Reveal';
  }
}
