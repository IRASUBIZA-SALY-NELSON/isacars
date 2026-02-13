import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Car,
  Activity,
  DollarSign,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  MapPin
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    totalRevenue: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, these would be separate admin endpoints
      // For this clone, we'll simulate by fetching available data

      // Mocking admin data or fetching what we can
      const ridesRes = await api.get('/rides/history'); // This usually returns user's history, admin endpoint needed
      // Since we don't have dedicated admin endpoints in the backend for *all* data yet,
      // we'll visualize the structure. In a real scenario: await api.get('/admin/stats');

      setStats({
        totalUsers: 124,
        totalDrivers: 45,
        totalRides: 892,
        totalRevenue: 15430
      });

      setRecentRides([
        {
          id: 1,
          passenger: 'John Doe',
          driver: 'Mike Smith',
          status: 'completed',
          fare: 24.50,
          date: '2026-02-13T10:30:00'
        },
        {
          id: 2,
          passenger: 'Alice Johnson',
          driver: 'Sarah Connor',
          status: 'started',
          fare: 18.00,
          date: '2026-02-13T10:45:00'
        },
        {
          id: 3,
          passenger: 'Bob Wilson',
          driver: 'James Bond',
          status: 'pending',
          fare: 0,
          date: '2026-02-13T11:00:00'
        }
      ]);

      setDrivers([
        {
          id: 1,
          name: 'Mike Smith',
          status: 'online',
          rating: 4.8,
          rides: 156
        },
        {
          id: 2,
          name: 'Sarah Connor',
          status: 'busy',
          rating: 4.9,
          rides: 89
        },
        {
          id: 3,
          name: 'James Bond',
          status: 'offline',
          rating: 5.0,
          rides: 42
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={20} />
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            Users & Drivers
          </button>
          <button
            className={`nav-item ${activeTab === 'rides' ? 'active' : ''}`}
            onClick={() => setActiveTab('rides')}
          >
            <Car size={20} />
            Rides Management
          </button>
          <button
            className={`nav-item ${activeTab === 'finance' ? 'active' : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            <DollarSign size={20} />
            Financials
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <header className="content-header">
          <h1 className="page-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="header-search">
            <Search size={20} />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <span>Admin</span>
          </div>
        </header>

        <div className="content-body">
          {/* Stats Row */}
          {activeTab === 'overview' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon bg-blue">
                    <Users size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-green">
                    <Car size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>Active Drivers</h3>
                    <p>{stats.totalDrivers}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-purple">
                    <Activity size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>Total Rides</h3>
                    <p>{stats.totalRides}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-orange">
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <p>${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-split">
                {/* Recent Rides Table */}
                <div className="card table-card">
                  <div className="card-header">
                    <h3>Recent Rides</h3>
                    <button className="btn btn-sm btn-secondary">View All</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Passenger</th>
                          <th>Driver</th>
                          <th>Status</th>
                          <th>Fare</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRides.map(ride => (
                          <tr key={ride.id}>
                            <td>#{ride.id}</td>
                            <td>{ride.passenger}</td>
                            <td>{ride.driver}</td>
                            <td>
                              <span className={`badge badge-${getStatusColor(ride.status)}`}>
                                {ride.status}
                              </span>
                            </td>
                            <td>${ride.fare.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Active Drivers List */}
                <div className="card drivers-card">
                  <div className="card-header">
                    <h3>Top Drivers</h3>
                  </div>
                  <div className="drivers-list">
                    {drivers.map(driver => (
                      <div key={driver.id} className="driver-item">
                        <div className="driver-info-compact">
                          <div className="driver-avatar-small">{driver.name.charAt(0)}</div>
                          <div>
                            <strong>{driver.name}</strong>
                            <div className="driver-status-indicator">
                              <span className={`status-dot ${driver.status}`}></span>
                              {driver.status}
                            </div>
                          </div>
                        </div>
                        <div className="driver-stats-compact">
                          <span>⭐ {driver.rating}</span>
                          <span>🚗 {driver.rides}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'overview' && (
            <div className="placeholder-content">
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
              <p>Detailed management view for {activeTab} coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    accepted: 'info',
    started: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return colors[status] || 'secondary';
};

export default AdminDashboard;
