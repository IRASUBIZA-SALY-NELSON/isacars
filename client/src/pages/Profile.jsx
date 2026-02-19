import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, Camera, User, Mail, Phone, Lock, Bell,
  Shield, CreditCard, LogOut, ChevronRight, Trash2,
  MapPin, CheckCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.j@example.com',
    phone: '+250 788 123 456',
    address: 'Kigali, Kimihurura'
  });
  const [avatar, setAvatar] = useState(user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        toast.success('Profile photo updated locally!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowPasswordModal(false);
      setPasswords({ current: '', new: '', confirm: '' });
      toast.success('Security credentials updated!', { icon: '🔐' });
    }, 1500);
  };

  const handleToggle = (setting, status) => {
    toast.success(`${setting} ${status ? 'enabled' : 'disabled'}`, {
      icon: status ? '🔔' : '🔕',
      duration: 2000
    });
  };

  const handleDeleteAccount = () => {
    toast((t) => (
      <span>
        Are you sure? <b>This is permanent.</b>
        <button
          onClick={() => { toast.dismiss(t.id); toast.error('Account deletion requested.'); }}
          style={{marginLeft: '10px', background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}
        >
          Confirm
        </button>
      </span>
    ), { duration: 5000, icon: '⚠️' });
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate('/passenger/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1>Profile Settings</h1>
      </header>

      <div className="profile-container">
        {/* Hero Section */}
        <section className="hero-profile-section">
          <div className="avatar-wrapper">
            <img
              src={avatar}
              alt="Profile"
              className="avatar-main"
            />
            <label htmlFor="avatar-upload" className="edit-avatar-btn">
              <Camera size={16} />
              <input
                type="file"
                id="avatar-upload"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <h2>{formData.name}</h2>
          <div className="user-status-badge">
            <CheckCircle size={12} />
            <span>Verified Passenger</span>
          </div>
        </section>

        <div className="settings-grid">
          {/* Personal Information */}
          <section className="settings-card">
            <h3><User size={20} color="#22c55e" /> Personal Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  name="name"
                  className="modern-input"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  className="modern-input"
                  value={formData.email}
                  disabled
                />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  name="phone"
                  className="modern-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="action-row">
              <button className="btn-save" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className="settings-card">
            <h3><Bell size={20} color="#22c55e" /> Notifications & Privacy</h3>
            <div className="preference-item">
              <div className="pref-info">
                <h4>Push Notifications</h4>
                <p>Receive updates about your rides</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked onChange={(e) => handleToggle('Push Notifications', e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div className="pref-info">
                <h4>Email Updates</h4>
                <p>Get receipts and monthly reports</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked onChange={(e) => handleToggle('Email Updates', e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div className="pref-info">
                <h4>Location Sharing</h4>
                <p>Allow drivers to see your precise location</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked onChange={(e) => handleToggle('Location Sharing', e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </section>

          {/* Security */}
          <section className="settings-card">
            <h3><Lock size={20} color="#22c55e" /> Security</h3>
            <button
              className="btn-danger-outline"
              style={{ color: '#0f172a', borderColor: '#e2e8f0' }}
              onClick={() => setShowPasswordModal(true)}
            >
              <Lock size={18} />
              Change Password
            </button>
            <div className="danger-zone" style={{ marginTop: '16px' }}>
              <button className="btn-danger-outline" onClick={handleDeleteAccount}>
                <Trash2 size={18} />
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal-card">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="close-modal-btn" onClick={() => setShowPasswordModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    className="modern-input"
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    className="modern-input"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    className="modern-input"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
