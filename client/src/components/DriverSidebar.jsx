import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, History, Car, User, LogOut, Activity, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './DriverSidebar.css';

const DriverSidebar = ({ isOpen, onClose, collapsed, isAvailable, onToggleAvailability, currentPage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully', { icon: '👋' });
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', icon: <Activity size={20} />, label: 'Dashboard', path: '/driver/dashboard' },
    { id: 'earnings', icon: <TrendingUp size={20} />, label: 'Earnings', path: '/driver/earnings' },
    { id: 'history', icon: <History size={20} />, label: 'Trip History', path: '/driver/history' },
    { id: 'vehicle', icon: <Car size={20} />, label: 'Vehicle', path: '/driver/vehicle' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile', path: '/driver/profile' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`driver-sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <span className="brand-name">Nova Driver</span>
          {isOpen && (
            <button className="close-mobile-sidebar" onClick={onClose} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'white' }}>
              <X size={24} />
            </button>
          )}
        </div>

        <div className="driver-profile-mini">
          <div className="profile-top">
            <div className="driver-avatar-circle">
              {user?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            {!collapsed && (
              <div className="driver-meta">
                <h4>{user?.name || 'Driver'}</h4>
                <p>4.9 ★ Rating</p>
              </div>
            )}
          </div>

          {!collapsed && onToggleAvailability && (
            <div className="availability-toggle">
              <span className="toggle-label">{isAvailable ? 'Go Offline' : 'Go Online'}</span>
              <label className="switch">
                <input type="checkbox" checked={isAvailable} onChange={onToggleAvailability} />
                <span className="slider"></span>
              </label>
            </div>
          )}
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                if (isOpen) onClose();
              }}
            >
              {item.icon}
              <span className="menu-item-text">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="menu-item" onClick={handleLogout} style={{ color: '#f87171' }}>
            <LogOut size={20} />
            <span className="menu-item-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DriverSidebar;
