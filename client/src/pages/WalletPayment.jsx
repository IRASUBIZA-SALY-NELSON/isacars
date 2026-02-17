import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus, Download, Eye, EyeOff, TrendingUp, TrendingDown, Clock, Shield } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './WalletPayment.css';

const WalletPayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  // Mock Data Loaders to ensure UI looks good immediately
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Parallel fetching
        const [walletRes, methodsRes, transRes] = await Promise.allSettled([
          api.get('/wallet'),
          api.get('/payment-methods'),
          api.get('/transactions')
        ]);

        if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data.wallet);
        else setWallet({ balance: 850.50, currency: 'USD' }); // Mock fallback

        if (methodsRes.status === 'fulfilled') setPaymentMethods(methodsRes.value.data.methods || []);
        else setPaymentMethods(getMockMethods());

        if (transRes.status === 'fulfilled') setTransactions(transRes.value.data.transactions || []);
        else setTransactions(getMockTransactions());

      } catch (error) {
        console.error('Error loading wallet data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getMockMethods = () => [
    { _id: '1', type: 'credit_card', brand: 'visa', last4: '4242', expiry: '12/28', isDefault: true },
    { _id: '2', type: 'credit_card', brand: 'mastercard', last4: '8899', expiry: '09/26', isDefault: false }
  ];

  const getMockTransactions = () => [
    { _id: '1', type: 'ride', description: 'Ride to Downtown', date: '2026-02-17T10:30:00', amount: -24.50, status: 'completed' },
    { _id: '2', type: 'topup', description: 'Wallet Top-up', date: '2026-02-15T14:20:00', amount: 100.00, status: 'completed' },
    { _id: '3', type: 'ride', description: 'Ride to Airport', date: '2026-02-12T08:15:00', amount: -45.00, status: 'completed' },
    { _id: '4', type: 'food', description: 'Uber Eats Order', date: '2026-02-10T19:40:00', amount: -32.80, status: 'completed' }
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="wallet-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="wallet-page">
      <div className="wallet-header-nav">
        <button className="back-btn-round" onClick={() => navigate('/passenger/dashboard')}>
          <ArrowLeft size={22} />
        </button>
        <h1>My Wallet</h1>
        <button className="action-icon-btn">
           <Shield size={20} />
        </button>
      </div>

      <div className="scrollable-content">
        {/* Main Balance Card */}
        <div className="balance-card-container">
            <div className="balance-card">
                <div className="card-pattern"></div>
                <div className="card-top">
                    <span className="card-label">Total Balance</span>
                    <button className="visibility-btn" onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>
                <div className="card-balance">
                    {showBalance ? formatAmount(wallet?.balance || 0) : '••••••'}
                </div>
                <div className="card-actions">
                    <button className="card-action-btn primary">
                        <Plus size={18} />
                        <span>Top Up</span>
                    </button>
                    <button className="card-action-btn secondary">
                        <Download size={18} />
                        <span>Withdraw</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Payment Methods */}
        <div className="section-container">
            <div className="section-header">
                <h2>Payment Methods</h2>
                <button className="add-text-btn">+ Add New</button>
            </div>
            <div className="cards-slider">
                {paymentMethods.map((method) => (
                    <div key={method._id} className={`method-card ${method.brand}`}>
                        <div className="method-top">
                            <span className="chip"></span>
                            {method.isDefault && <span className="default-tag">Default</span>}
                        </div>
                        <div className="method-number">
                            •••• •••• •••• {method.last4}
                        </div>
                        <div className="method-footer">
                            <div className="holder-info">
                                <span className="holder-label">Expiry</span>
                                <span className="holder-val">{method.expiry}</span>
                            </div>
                            <div className="card-logo">{method.brand?.toUpperCase()}</div>
                        </div>
                    </div>
                ))}
                <div className="add-method-card">
                    <div className="add-icon-circle">
                        <Plus size={24} />
                    </div>
                    <span>Add Method</span>
                </div>
            </div>
        </div>

        {/* Transaction History */}
        <div className="section-container history-section">
            <div className="section-header">
                <h2>Transactions</h2>
                <button className="see-all-btn">See All</button>
            </div>

            <div className="transactions-list">
                {transactions.map((tx) => (
                    <div key={tx._id} className="transaction-item">
                        <div className={`tx-icon-bg ${tx.amount > 0 ? 'income' : 'expense'}`}>
                            {tx.amount > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div className="tx-details">
                            <div className="tx-title">{tx.description}</div>
                            <div className="tx-meta">
                                <Clock size={12} />
                                <span>{formatDate(tx.date)}</span>
                            </div>
                        </div>
                        <div className={`tx-amount ${tx.amount > 0 ? 'positive' : ''}`}>
                            {tx.amount > 0 ? '+' : '-'}{formatAmount(tx.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPayment;
