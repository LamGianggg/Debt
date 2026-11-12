// Cactus Practice API Service
// Communicates with Spring Boot backend via /api (Vite proxy to http://localhost:8080)

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('cactus_token');
  const savedUser = localStorage.getItem('cactus_user');
  let currentRole = 'ROLE_USER';
  if (savedUser) {
    try {
      const u = JSON.parse(savedUser);
      if (u.roles && u.roles.includes('ROLE_ADMIN')) currentRole = 'ROLE_ADMIN';
      else if (u.roles && u.roles.includes('ROLE_STAFF')) currentRole = 'ROLE_STAFF';
      else currentRole = 'ROLE_USER';
    } catch (_) {}
  }
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Role': currentRole,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.message) {
        errorMsg = errorJson.message;
      }
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const json = await response.json();
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Health / Check connection
  async checkConnection() {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview?timeframe=today`, { method: 'GET' });
      return res.ok;
    } catch (_) {
      return false;
    }
  },

  // Auth & RBAC endpoints
  async login(credentials) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data && data.token) {
      localStorage.setItem('cactus_token', data.token);
    }
    return data;
  },

  async register(userData) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async getCurrentUser() {
    return request('/auth/me');
  },

  // Admin & User Management endpoints
  async getUsers() {
    return request('/admin/users');
  },

  async createUser(userData) {
    return request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async updateUserRoles(userId, roles) {
    return request(`/admin/users/${userId}/roles`, {
      method: 'PUT',
      body: JSON.stringify(roles)
    });
  },

  async toggleUserStatus(userId, enabled) {
    return request(`/admin/users/${userId}/status?enabled=${enabled}`, {
      method: 'PUT'
    });
  },

  // Analytics & Overview
  async getOverview(timeframe = '30d') {
    return request(`/analytics/overview?timeframe=${encodeURIComponent(timeframe)}`);
  },

  async getReports() {
    return request('/analytics/reports');
  },

  // Transactions
  async getTransactions() {
    return request('/transactions');
  },

  async getTransaction(id) {
    return request(`/transactions/${encodeURIComponent(id)}`);
  },

  async createPayment(chargeData) {
    return request('/transactions', {
      method: 'POST',
      body: JSON.stringify(chargeData)
    });
  },

  async refundPayment(id) {
    return request(`/transactions/${encodeURIComponent(id)}/refund`, {
      method: 'POST'
    });
  },

  // Customers
  async getCustomers() {
    return request('/customers');
  },

  async getCustomer(id) {
    return request(`/customers/${encodeURIComponent(id)}`);
  },

  async createCustomer(customerData) {
    return request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  },

  // Payouts & Balances
  async getPayouts() {
    return request('/payouts');
  },

  async getPayoutSummary() {
    return request('/payouts/summary');
  },

  async createPayout(payoutData) {
    return request('/payouts', {
      method: 'POST',
      body: JSON.stringify(payoutData)
    });
  },

  // Connected Accounts
  async getConnectedAccounts() {
    return request('/connected-accounts');
  },

  async createConnectedAccount(accountData) {
    return request('/connected-accounts', {
      method: 'POST',
      body: JSON.stringify(accountData)
    });
  },

  // Products
  async getProducts() {
    return request('/products');
  },

  async createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  // O2C & AR Automation Workflow APIs
  async getO2CKpis() {
    return request('/o2c/kpis');
  },

  async getOrders() {
    return request('/o2c/orders');
  },

  async approveOrderCredit(id, approver = 'Admin / Head of Credit') {
    return request(`/o2c/orders/${encodeURIComponent(id)}/approve?approver=${encodeURIComponent(approver)}`, {
      method: 'POST'
    });
  },

  async getInvoices() {
    return request('/o2c/invoices');
  },

  async payInvoice(id, amount = 'Full') {
    return request(`/o2c/invoices/${encodeURIComponent(id)}/pay`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  },

  async getDunningWorklist() {
    return request('/o2c/dunning');
  },

  async sendDunningReminder(id) {
    return request(`/o2c/dunning/${encodeURIComponent(id)}/send`, {
      method: 'POST'
    });
  },

  async getPtpDisputes() {
    return request('/o2c/ptp-disputes');
  },

  async createPtp(data) {
    return request('/o2c/ptp', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async resolveDispute(id, resolution = 'Đã đối soát và chấp thuận điều chỉnh Credit Memo') {
    return request(`/o2c/disputes/${encodeURIComponent(id)}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolution })
    });
  },

  async getReconciliationFeeds() {
    return request('/o2c/reconciliation');
  },

  async applyDeMinimis(txId) {
    return request(`/o2c/reconciliation/${encodeURIComponent(txId)}/de-minimis`, {
      method: 'POST'
    });
  },

  async getMakerCheckerRequests() {
    return request('/o2c/maker-checker');
  },

  async processMakerChecker(id, approved = true, checker = 'Admin / Head of Credit') {
    return request(`/o2c/maker-checker/${encodeURIComponent(id)}/process`, {
      method: 'POST',
      body: JSON.stringify({ approved, checker })
    });
  },

  // Direct file downloads (CSV / JSON export)
  downloadExport(format = 'csv') {
    const url = `${API_BASE}/transactions/export/${format}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `debt_transactions.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
