import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, Plus, Trash2, Download, Eye, EyeOff, Check, X, AlertCircle, TrendingUp, DollarSign, Shield, Smartphone } from 'lucide-react';
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
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    walletProvider: '',
    walletNumber: ''
  });

  useEffect(() => {
    fetchWalletData();
    fetchPaymentMethods();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await api.get('/wallet');
      setWallet(response.data.wallet);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      // Mock data for demonstration
      setWallet({
        balance: 125.50,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      });
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/payment-methods');
      setPaymentMethods(response.data.methods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Mock data for demonstration
      setPaymentMethods([
        {
          _id: '1',
          type: 'credit_card',
          cardType: 'visa',
          lastFour: '4242',
          expiryMonth: '12',
          expiryYear: '2025',
          cardholderName: 'John Doe',
          isDefault: true,
          billingAddress: '123 Main St, New York, NY'
        },
        {
          _id: '2',
          type: 'debit_card',
          cardType: 'mastercard',
          lastFour: '8888',
          expiryMonth: '08',
          expiryYear: '2024',
          cardholderName: 'John Doe',
          isDefault: false,
          billingAddress: '123 Main St, New York, NY'
        },
        {
          _id: '3',
          type: 'digital_wallet',
          provider: 'paypal',
          email: 'john.doe@example.com',
          isDefault: false
        }
      ]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Mock data for demonstration
      setTransactions([
        {
          _id: '1',
          type: 'ride_payment',
          amount: -25.50,
          description: 'Ride from 123 Main St to 456 Broadway',
          date: '2024-01-15T10:55:00Z',
          status: 'completed',
          paymentMethod: 'credit_card',
          rideId: 'ride_123'
        },
        {
          _id: '2',
          type: 'wallet_topup',
          amount: 50.00,
          description: 'Wallet top-up via Visa ending in 4242',
          date: '2024-01-14T15:30:00Z',
          status: 'completed',
          paymentMethod: 'credit_card'
        },
        {
          _id: '3',
          type: 'ride_payment',
          amount: -18.75,
          description: 'Ride from 789 5th Ave to 321 Park Ave',
          date: '2024-01-14T14:38:00Z',
          status: 'completed',
          paymentMethod: 'wallet',
          rideId: 'ride_456'
        },
        {
          _id: '4',
          type: 'refund',
          amount: 12.00,
          description: 'Refund for cancelled ride',
          date: '2024-01-13T09:25:00Z',
          status: 'completed',
          paymentMethod: 'credit_card'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    
    if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
      toast.error('Please fill all card details');
      return;
    }

    try {
      const cardData = {
        type: 'credit_card',
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardholderName: formData.cardName,
        expiryMonth: formData.expiryDate.split('/')[0],
        expiryYear: formData.expiryDate.split('/')[1],
        cvv: formData.cvv,
        billingAddress: formData.billingAddress
      };

      const response = await api.post('/payment-methods', cardData);
      setPaymentMethods([...paymentMethods, response.data.method]);
      setShowAddCard(false);
      setFormData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: ''
      });
      toast.success('Card added successfully');
    } catch (error) {
      toast.error('Failed to add card');
      // Mock success for demonstration
      const newCard = {
        _id: Date.now().toString(),
        type: 'credit_card',
        cardType: 'visa',
        lastFour: formData.cardNumber.slice(-4),
        expiryMonth: formData.expiryDate.split('/')[0],
        expiryYear: formData.expiryDate.split('/')[1],
        cardholderName: formData.cardName,
        isDefault: false,
        billingAddress: formData.billingAddress
      };
      setPaymentMethods([...paymentMethods, newCard]);
      setShowAddCard(false);
      setFormData({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: ''
      });
      toast.success('Card added successfully');
    }
  };

  const handleAddWallet = async (e) => {
    e.preventDefault();
    
    if (!formData.walletProvider || !formData.walletNumber) {
      toast.error('Please fill wallet details');
      return;
    }

    try {
      const walletData = {
        type: 'digital_wallet',
        provider: formData.walletProvider,
        walletNumber: formData.walletNumber
      };

      const response = await api.post('/payment-methods', walletData);
      setPaymentMethods([...paymentMethods, response.data.method]);
      setShowAddWallet(false);
      setFormData({
        ...formData,
        walletProvider: '',
        walletNumber: ''
      });
      toast.success('Digital wallet added successfully');
    } catch (error) {
      toast.error('Failed to add digital wallet');
      // Mock success for demonstration
      const newWallet = {
        _id: Date.now().toString(),
        type: 'digital_wallet',
        provider: formData.walletProvider,
        email: formData.walletNumber,
        isDefault: false
      };
      setPaymentMethods([...paymentMethods, newWallet]);
      setShowAddWallet(false);
      setFormData({
        ...formData,
        walletProvider: '',
        walletNumber: ''
      });
      toast.success('Digital wallet added successfully');
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      await api.put(`/payment-methods/${methodId}/set-default`);
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        isDefault: method._id === methodId
      })));
      toast.success('Default payment method updated');
    } catch (error) {
      toast.error('Failed to update default payment method');
      // Mock success for demonstration
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        isDefault: method._id === methodId
      })));
      toast.success('Default payment method updated');
    }
  };

  const handleDeleteMethod = async (methodId) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      await api.delete(`/payment-methods/${methodId}`);
      setPaymentMethods(paymentMethods.filter(method => method._id !== methodId));
      toast.success('Payment method removed');
    } catch (error) {
      toast.error('Failed to remove payment method');
      // Mock success for demonstration
      setPaymentMethods(paymentMethods.filter(method => method._id !== methodId));
      toast.success('Payment method removed');
    }
  };

  const handleTopUp = async () => {
    const amount = prompt('Enter amount to add to wallet:');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await api.post('/wallet/topup', { amount: parseFloat(amount) });
      setWallet({
        ...wallet,
        balance: wallet.balance + parseFloat(amount)
      });
      
      // Add transaction record
      const newTransaction = {
        _id: Date.now().toString(),
        type: 'wallet_topup',
        amount: parseFloat(amount),
        description: `Wallet top-up of $${parseFloat(amount)}`,
        date: new Date().toISOString(),
        status: 'completed',
        paymentMethod: 'credit_card'
      };
      setTransactions([newTransaction, ...transactions]);
      
      toast.success(`$${parseFloat(amount)} added to wallet`);
    } catch (error) {
      toast.error('Failed to top up wallet');
      // Mock success for demonstration
      setWallet({
        ...wallet,
        balance: wallet.balance + parseFloat(amount)
      });
      
      const newTransaction = {
        _id: Date.now().toString(),
        type: 'wallet_topup',
        amount: parseFloat(amount),
        description: `Wallet top-up of $${parseFloat(amount)}`,
        date: new Date().toISOString(),
        status: 'completed',
        paymentMethod: 'credit_card'
      };
      setTransactions([newTransaction, ...transactions]);
      
      toast.success(`$${parseFloat(amount)} added to wallet`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCardNumber = (number) => {
    return number.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || number;
  };

  const getCardIcon = (cardType) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳'
    };
    return icons[cardType.toLowerCase()] || '💳';
  };

  const getWalletIcon = (provider) => {
    const icons = {
      paypal: '💰',
      apple_pay: '🍎',
      google_pay: '🟢',
      samsung_pay: '📱'
    };
    return icons[provider.toLowerCase()] || '💰';
  };

  if (loading) {
    return (
      <div className="wallet-payment-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="wallet-payment-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/passenger/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Wallet & Payment</h1>
        </div>
      </div>

      {/* Wallet Balance Section */}
      <div className="wallet-section">
        <div className="wallet-card">
          <div className="wallet-header">
            <div className="wallet-title">
              <Wallet size={24} />
              <h2>Wallet Balance</h2>
            </div>
            <button 
              className="toggle-balance-btn"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="wallet-balance">
            <div className="balance-amount">
              {showBalance ? `$${wallet?.balance.toFixed(2) || '0.00'}` : '••••••'}
            </div>
            <div className="balance-currency">USD</div>
          </div>

          <div className="wallet-actions">
            <button className="btn btn-primary" onClick={handleTopUp}>
              <Plus size={16} />
              Add Money
            </button>
            <button className="btn btn-secondary">
              <Download size={16} />
              Statement
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="wallet-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">
                ${transactions.filter(t => t.type === 'wallet_topup').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </div>
              <div className="stat-label">Total Added</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-number">
                ${Math.abs(transactions.filter(t => t.type === 'ride_payment' && t.paymentMethod === 'wallet').reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
              </div>
              <div className="stat-label">Spent from Wallet</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="payment-methods-section">
        <div className="section-header">
          <h2>Payment Methods</h2>
          <div className="add-buttons">
            <button className="btn btn-outline" onClick={() => setShowAddCard(true)}>
              <CreditCard size={16} />
              Add Card
            </button>
            <button className="btn btn-outline" onClick={() => setShowAddWallet(true)}>
              <Smartphone size={16} />
              Add Wallet
            </button>
          </div>
        </div>

        <div className="payment-methods-list">
          {paymentMethods.length === 0 ? (
            <div className="empty-state">
              <CreditCard size={48} className="empty-icon" />
              <h3>No payment methods</h3>
              <p>Add a credit card or digital wallet to get started</p>
            </div>
          ) : (
            paymentMethods.map(method => (
              <div key={method._id} className={`payment-method-card ${method.isDefault ? 'default' : ''}`}>
                <div className="method-info">
                  <div className="method-icon">
                    {method.type === 'credit_card' || method.type === 'debit_card' ? (
                      <>
                        <span className="card-emoji">{getCardIcon(method.cardType)}</span>
                        <div className="card-details">
                          <div className="card-name capitalize">{method.cardType}</div>
                          <div className="card-number">•••• •••• •••• {method.lastFour}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="wallet-emoji">{getWalletIcon(method.provider)}</span>
                        <div className="wallet-details">
                          <div className="wallet-name capitalize">{method.provider}</div>
                          <div className="wallet-email">{method.email}</div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="method-meta">
                    {method.isDefault && (
                      <div className="default-badge">
                        <Check size={12} />
                        Default
                      </div>
                    )}
                    {(method.type === 'credit_card' || method.type === 'debit_card') && (
                      <div className="expiry">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </div>
                    )}
                  </div>
                </div>

                <div className="method-actions">
                  {!method.isDefault && (
                    <button 
                      className="action-btn set-default"
                      onClick={() => handleSetDefault(method._id)}
                      title="Set as default"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteMethod(method._id)}
                    title="Remove method"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="transactions-section">
        <div className="section-header">
          <h2>Recent Transactions</h2>
          <button className="btn btn-outline">
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="transactions-list">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <DollarSign size={48} className="empty-icon" />
              <h3>No transactions</h3>
              <p>Your transaction history will appear here</p>
            </div>
          ) : (
            transactions.map(transaction => (
              <div key={transaction._id} className="transaction-item">
                <div className="transaction-icon">
                  {transaction.type === 'ride_payment' && <DollarSign size={20} className="expense" />}
                  {transaction.type === 'wallet_topup' && <TrendingUp size={20} className="income" />}
                  {transaction.type === 'refund' && <AlertCircle size={20} className="refund" />}
                </div>
                
                <div className="transaction-details">
                  <div className="transaction-description">{transaction.description}</div>
                  <div className="transaction-meta">
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                    <span className={`transaction-status ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>

                <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="modal-overlay" onClick={() => setShowAddCard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Credit/Debit Card</h2>
              <button className="close-btn" onClick={() => setShowAddCard(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCard} className="modal-body">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        const formatted = value.length > 2 ? `${value.slice(0,2)}/${value.slice(2)}` : value;
                        setFormData({...formData, expiryDate: formatted});
                      }
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Billing Address</label>
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddCard(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Digital Wallet Modal */}
      {showAddWallet && (
        <div className="modal-overlay" onClick={() => setShowAddWallet(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Digital Wallet</h2>
              <button className="close-btn" onClick={() => setShowAddWallet(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddWallet} className="modal-body">
              <div className="form-group">
                <label>Wallet Provider</label>
                <select
                  name="walletProvider"
                  value={formData.walletProvider}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select wallet</option>
                  <option value="paypal">PayPal</option>
                  <option value="apple_pay">Apple Pay</option>
                  <option value="google_pay">Google Pay</option>
                  <option value="samsung_pay">Samsung Pay</option>
                </select>
              </div>

              <div className="form-group">
                <label>Email or Phone Number</label>
                <input
                  type="text"
                  name="walletNumber"
                  value={formData.walletNumber}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddWallet(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPayment;
