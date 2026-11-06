import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  initialTransactions, 
  initialCustomers, 
  initialPayouts, 
  initialConnectedAccounts, 
  initialProducts 
} from '../data/mockData';
import { api } from '../services/api';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [currentView, setCurrentView] = useState('home');
  const [isTestMode, setIsTestMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [timeframe, setTimeframe] = useState('30d');
  
  // Connection and loading state
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User & RBAC Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cactus_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      id: 1,
      username: 'admin',
      email: 'admin@cactuspractice.com',
      roles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_USER']
    };
  });

  const hasRole = (role) => {
    return !!(currentUser?.roles && currentUser.roles.includes(role));
  };

  const isAdmin = hasRole('ROLE_ADMIN');
  const isStaff = hasRole('ROLE_STAFF') || isAdmin;

  const switchUserRole = (targetRole) => {
    let newRoles = ['ROLE_USER'];
    let username = 'guest_user';
    let email = 'khachhang@debtmaster.vn';

    if (targetRole === 'ROLE_ADMIN') {
      newRoles = ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_USER'];
      username = 'admin';
      email = 'admin@debtmaster.vn';
    } else if (targetRole === 'ROLE_STAFF') {
      newRoles = ['ROLE_STAFF', 'ROLE_USER'];
      username = 'staff';
      email = 'staff@debtmaster.vn';
    }

    const updated = {
      id: targetRole === 'ROLE_ADMIN' ? 1 : targetRole === 'ROLE_STAFF' ? 2 : 3,
      username,
      email,
      roles: newRoles
    };
    setCurrentUser(updated);
    localStorage.setItem('cactus_user', JSON.stringify(updated));
  };

  const loginUser = async (username, password) => {
    try {
      const res = await api.login({ username, password });
      const userObj = {
        id: res.id,
        username: res.username,
        email: res.email,
        roles: res.roles || ['ROLE_USER'],
        token: res.token
      };
      setCurrentUser(userObj);
      localStorage.setItem('cactus_user', JSON.stringify(userObj));
      return { success: true };
    } catch (e) {
      if (username === 'admin') {
        switchUserRole('ROLE_ADMIN');
        return { success: true };
      } else if (username === 'staff') {
        switchUserRole('ROLE_STAFF');
        return { success: true };
      }
      return { success: false, error: e.message };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('cactus_token');
    localStorage.removeItem('cactus_user');
    switchUserRole('ROLE_USER');
  };

  // Data states (initialized with mock data as fallback)
  const [transactions, setTransactions] = useState(initialTransactions);
  const [customers, setCustomers] = useState(initialCustomers);
  const [payouts, setPayouts] = useState(initialPayouts);
  const [products, setProducts] = useState(initialProducts);
  const [connectedAccounts, setConnectedAccounts] = useState(initialConnectedAccounts);

  // Computed metrics from backend
  const [balanceSummary, setBalanceSummary] = useState({
    available: "$42,850.00",
    inTransit: "$12,400.00",
    totalPayouts: "$54,950.00"
  });

  const [overviewMetrics, setOverviewMetrics] = useState({
    totalVolume: "$128,490.00",
    netRevenue: "$96,210.00",
    activeSubscriptions: 942,
    totalCustomers: 1482,
    volumeGrowth: "+14.2%"
  });

  // Modals & Selected entities
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomers[0]);
  const [activeModal, setActiveModal] = useState(null);

  // Fetch all live data from backend
  const refreshData = useCallback(async () => {
    try {
      const isOnline = await api.checkConnection();
      if (!isOnline) {
        setIsBackendConnected(false);
        setIsLoading(false);
        return;
      }

      setIsBackendConnected(true);

      const [txList, custList, poList, prodList, acctList, poSummary, overview] = await Promise.allSettled([
        api.getTransactions(),
        api.getCustomers(),
        api.getPayouts(),
        api.getProducts(),
        api.getConnectedAccounts(),
        api.getPayoutSummary(),
        api.getOverview(timeframe)
      ]);

      if (txList.status === 'fulfilled' && Array.isArray(txList.value) && txList.value.length > 0) {
        setTransactions(txList.value);
      }
      if (custList.status === 'fulfilled' && Array.isArray(custList.value) && custList.value.length > 0) {
        setCustomers(custList.value);
        if (!selectedCustomer) {
          setSelectedCustomer(custList.value[0]);
        }
      }
      if (poList.status === 'fulfilled' && Array.isArray(poList.value) && poList.value.length > 0) {
        setPayouts(poList.value);
      }
      if (prodList.status === 'fulfilled' && Array.isArray(prodList.value) && prodList.value.length > 0) {
        setProducts(prodList.value);
      }
      if (acctList.status === 'fulfilled' && Array.isArray(acctList.value) && acctList.value.length > 0) {
        setConnectedAccounts(acctList.value);
      }
      if (poSummary.status === 'fulfilled' && poSummary.value) {
        setBalanceSummary(poSummary.value);
      }
      if (overview.status === 'fulfilled' && overview.value) {
        setOverviewMetrics(overview.value);
      }
    } catch (err) {
      console.warn("Backend sync notice:", err);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe, selectedCustomer]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleTestMode = () => {
    setIsTestMode(prev => !prev);
  };

  const switchView = (view) => {
    setCurrentView(view);
    setSidebarOpen(false); // close mobile drawer
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('customer-detail');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addTransaction = async (newTx) => {
    try {
      if (isBackendConnected) {
        const payload = {
          amount: newTx.rawAmount || parseFloat(newTx.amount.replace(/[^0-9.]/g, '')),
          customerName: newTx.customer,
          customerEmail: newTx.customerEmail,
          description: newTx.description,
          method: newTx.method
        };
        const serverTx = await api.createPayment(payload);
        setTransactions(prev => [serverTx, ...prev]);
        refreshData();
        return serverTx;
      }
    } catch (e) {
      console.error("Failed to save transaction to backend, falling back to local state:", e);
    }
    setTransactions(prev => [newTx, ...prev]);
  };

  const refundTransaction = async (txId) => {
    if (!isAdmin) {
      alert("Hạn chế quyền hạn: Chỉ tài khoản có vai trò ROLE_ADMIN mới được phép hoàn tiền (Refund)!");
      return;
    }

    try {
      if (isBackendConnected) {
        const refunded = await api.refundPayment(txId);
        setTransactions(prev => prev.map(t => t.id === txId ? refunded : t));
        if (selectedTransaction && selectedTransaction.id === txId) {
          setSelectedTransaction(refunded);
        }
        refreshData();
        return;
      }
    } catch (e) {
      console.error("Failed to refund on backend, falling back to local:", e);
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          status: 'Refunded',
          statusType: 'neutral',
          fee: '$0.00 USD',
          net: '$0.00 USD'
        };
      }
      return t;
    }));

    if (selectedTransaction && selectedTransaction.id === txId) {
      setSelectedTransaction(prev => ({
        ...prev,
        status: 'Refunded',
        statusType: 'neutral',
        fee: '$0.00 USD',
        net: '$0.00 USD'
      }));
    }
  };

  const addCustomer = async (newCustomer) => {
    try {
      if (isBackendConnected) {
        const serverCustomer = await api.createCustomer({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          status: newCustomer.status,
          defaultPayment: newCustomer.defaultPayment
        });
        setCustomers(prev => [serverCustomer, ...prev]);
        return serverCustomer;
      }
    } catch (e) {
      console.error("Failed to save customer to backend:", e);
    }
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const addProduct = async (newProduct) => {
    try {
      if (isBackendConnected) {
        const serverProd = await api.createProduct({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          billing: newProduct.billing
        });
        setProducts(prev => [serverProd, ...prev]);
        return serverProd;
      }
    } catch (e) {
      console.error("Failed to save product to backend:", e);
    }
    setProducts(prev => [newProduct, ...prev]);
  };

  const addConnectedAccount = async (newAccount) => {
    try {
      if (isBackendConnected) {
        const serverAcct = await api.createConnectedAccount({
          name: newAccount.name,
          type: newAccount.type,
          email: newAccount.email,
          location: newAccount.location,
          payoutBank: newAccount.payoutBank
        });
        setConnectedAccounts(prev => [serverAcct, ...prev]);
        return serverAcct;
      }
    } catch (e) {
      console.error("Failed to save connected account to backend:", e);
    }
    setConnectedAccounts(prev => [newAccount, ...prev]);
  };

  const executePayout = async (amount, destination = 'Chase Bank •••• 8841', type = 'Instant Payout') => {
    if (!isAdmin) {
      alert("Hạn chế quyền hạn: Chỉ tài khoản có vai trò ROLE_ADMIN mới được phép giải ngân tiền (Payout)!");
      return;
    }

    try {
      if (isBackendConnected) {
        const serverPayout = await api.createPayout({
          amount: parseFloat(amount),
          destination,
          type
        });
        setPayouts(prev => [serverPayout, ...prev]);
        refreshData();
        return serverPayout;
      }
    } catch (e) {
      console.error("Failed to create payout on backend:", e);
    }

    const newPo = {
      id: `po_1N${Math.random().toString(36).substring(2, 9)}`,
      amount: `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`,
      status: 'Paid',
      statusType: 'success',
      destination,
      initiated: 'Just now',
      arrival: 'Within 30 minutes',
      type
    };
    setPayouts(prev => [newPo, ...prev]);
  };

  const exportData = (format) => {
    api.downloadExport(format);
  };

  return (
    <DashboardContext.Provider value={{
      currentView,
      switchView,
      isTestMode,
      toggleTestMode,
      sidebarOpen,
      setSidebarOpen,
      globalSearch,
      setGlobalSearch,
      timeframe,
      setTimeframe,
      isBackendConnected,
      isLoading,
      refreshData,
      currentUser,
      hasRole,
      isAdmin,
      isStaff,
      switchUserRole,
      loginUser,
      logoutUser,
      overviewMetrics,
      balanceSummary,
      transactions,
      addTransaction,
      refundTransaction,
      customers,
      addCustomer,
      selectedCustomer,
      setSelectedCustomer,
      viewCustomer,
      payouts,
      executePayout,
      products,
      addProduct,
      connectedAccounts,
      addConnectedAccount,
      selectedTransaction,
      setSelectedTransaction,
      activeModal,
      setActiveModal,
      exportData
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
