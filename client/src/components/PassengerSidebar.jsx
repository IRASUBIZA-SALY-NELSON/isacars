import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  History, User, Shield, HelpCircle, LogOut, Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import './PassengerSidebar.css';

const PassengerSidebar = ({ isOpen, onClose, currentPage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Generate user initials from name
  const getUserInitials = (name) => {
    if (!name) return 'U';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully. See you soon!', { icon: '👋' });
    navigate('/');
    onClose();
  };

  const navItems = [
    { id: 'dashboard', icon: <Home size={22} />, label: 'Home', path: '/passenger/dashboard' },
    { id: 'history', icon: <History size={22} />, label: 'Ride History', path: '/passenger/ride-history' },
    { id: 'profile', icon: <User size={22} />, label: 'Profile Settings', path: '/passenger/profile' },
    { id: 'safety', icon: <Shield size={22} />, label: 'Safety Center', path: '/passenger/safety' },
    { id: 'support', icon: <HelpCircle size={22} />, label: 'Help & Support', path: '/passenger/support' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <div className={`passenger-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header-premium">
          <div className="sidebar-logo-section" onClick={() => { navigate('/'); onClose(); }}>
            <img src="/logo.png" alt="Nova" className="sidebar-logo-img" />
            <h2 className="sidebar-brand">Nova</h2>
          </div>

          <div className="user-profile-premium">
            <div className="avatar-wrapper-premium">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="sidebar-avatar"
                />
              ) : (
                <div className="sidebar-avatar-initials">
                  {getUserInitials(user?.name)}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h3>{user?.name || 'Passenger'}</h3>
              <p className="capitalize text-xs opacity-70">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-menu-premium">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item-p ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer-premium">
          <button className="menu-item-p logout-menu-item" onClick={handleLogout}>
            <LogOut size={22} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PassengerSidebar;
