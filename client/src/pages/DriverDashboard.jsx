import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, History, Car, User, LogOut, Menu, MapPin,
  Clock, Shield, ChevronRight, Bell, DollarSign, Star,
  Activity, X, Navigation, Phone, MessageCircle, CheckCircle
} from 'lucide-react';
import api from '../utils/api';
import socketService from '../services/socket';
import MapComponent from '../components/MapComponent';
import DriverSidebar from '../components/DriverSidebar';
import toast from 'react-hot-toast';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isAvailable, setIsAvailable] = useState(user?.driverDetails?.isAvailable || false);
  const [collapsed, setCollapsed] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [activeRide, setActiveRide] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [earnings, setEarnings] = useState({ rating: 4.9, totalRides: 154, total: 1250500 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveRide();
    fetchEarnings();
    setupSocketListeners();
    const cleanupLocation = startLocationTracking();

    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      socketService.off('newRideRequest');
      socketService.off('rideStatusUpdated');
      socketService.off('rideCancelled');
      if (cleanupLocation) cleanupLocation();
    };
  }, []);

  const setupSocketListeners = () => {
    socketService.on('newRideRequest', (ride) => {
      if (isAvailable && !activeRide) {
        toast.success('New Ride Request Received!', {
          icon: '🚖',
          duration: 6000,
          style: {
            background: '#0f172a',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        });
        setPendingRequests((prev) => [...prev, ride]);
      }
    });

    socketService.on('rideStatusUpdated', (ride) => {
      if (ride.driver?._id === user?.id || ride.driver === user?.id) {
        setActiveRide(ride);
      }
    });

    socketService.on('rideCancelled', () => {
        setActiveRide(null);
        toast.error('Ride was cancelled by passenger', { icon: '⚠️' });
        setPendingRequests([]);
    });
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          updateDriverLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  const updateDriverLocation = async (latitude, longitude) => {
    try {
      await api.put('/drivers/location', { latitude, longitude });
    } catch (error) {
      // Slient fail
    }
  };

  const fetchActiveRide = async () => {
    try {
      const response = await api.get('/rides/active');
      if (response.data.ride) setActiveRide(response.data.ride);
    } catch (error) {
           console.error('Error fetching active ride:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/drivers/earnings');
      if (response.data.earnings) setEarnings(response.data.earnings);
    } catch (error) {
        // Fallback to mock if API fails
    }
  };

  const toggleAvailability = async () => {
    setLoading(true);
    try {
      const newStatus = !isAvailable;
      await api.put('/drivers/availability', { isAvailable: newStatus });
      setIsAvailable(newStatus);
      toast.success(newStatus ? 'You are now Online' : 'You are now Offline', {
        icon: newStatus ? '✅' : '💤',
        style: { borderRadius: '12px' }
      });
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async (rideId) => {
    try {
      const response = await api.put(`/rides/${rideId}/accept`);
      setActiveRide(response.data.ride);
      setPendingRequests([]);
      setIsAvailable(false);
      toast.success('Ride accepted! Navigating to pickup...', { icon: '🏁' });
    } catch (error) {
      toast.error('Failed to accept ride');
    }
  };

  const denyRide = (rideId) => {
    setPendingRequests(prev => prev.filter(r => r._id !== rideId));
    toast('Request ignored', { icon: '⏭️' });
  };

  const updateRideStatus = async (status) => {
    if (!activeRide) return;
    try {
      const response = await api.put(`/rides/${activeRide._id}/status`, { status });
      setActiveRide(response.data.ride);

      const statusMessages = {
        'arrived': 'You have arrived at the pickup location!',
        'started': 'Trip started! Drive safely.',
        'completed': 'Trip completed! Well done.'
      };

      toast.success(statusMessages[status], { icon: '📋' });

      if (status === 'completed') {
        setActiveRide(null);
        setIsAvailable(true);
        fetchEarnings();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully', { icon: '👋' });
    navigate('/');
  };

  return (
    <div className="driver-dashboard">
      <DriverSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        isAvailable={isAvailable}
        onToggleAvailability={toggleAvailability}
        currentPage="dashboard"
      />

      {/* Main Area */}
      <main className="main-layout">
        <header className="main-header">
          <div className="header-left">
            <button className="collapse-btn" onClick={() => {
              if (window.innerWidth <= 768) setSidebarOpen(true);
              else setCollapsed(!collapsed);
            }}>
              <Menu size={20} />
            </button>
            <div className="header-meta">
              <h2>Overview</h2>
              <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
            </div>
          </div>

          <div className="header-right">
            <div className="header-stat">
              <DollarSign size={16} color="#22c55e" />
              <span>{earnings.total?.toLocaleString()} RWF</span>
            </div>
            <button className="notification-btn" onClick={() => setSidebarOpen(true)}>
              <Bell size={20} />
              {pendingRequests.length > 0 && <span className="notification-badge">{pendingRequests.length}</span>}
            </button>
            <div className="driver-avatar-circle" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="map-viewport">
          <MapComponent
            status={activeRide?.status}
            pickup={activeRide?.pickupLocation}
            dropoff={activeRide?.dropoffLocation}
            driver={activeRide?.driver?.driverDetails?.currentLocation}
          />

          {/* Floating Actions */}
          <div className="bottom-actions-container">
            {/* Incoming Request */}
            {pendingRequests.length > 0 && !activeRide && (
              <div className="ride-request-card">
                <div className="card-header-premium">
                  <span className="request-badge">New Request</span>
                  <div className="fare-tag">{pendingRequests[0].fare.total} RWF</div>
                </div>

                {/* Passenger Details */}
                <div className="passenger-section">
                  <div className="passenger-info">
                    <div className="passenger-avatar">
                      <User size={24} />
                    </div>
                    <div className="passenger-details">
                      <h4 className="passenger-name">{pendingRequests[0].passenger?.name || 'Passenger'}</h4>
                      <div className="passenger-contact">
                        <Phone size={14} />
                        <span>{pendingRequests[0].passenger?.phone || '+250 7XX XXX XXX'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="passenger-rating">
                    <Star size={16} className="star-icon" />
                    <span>{pendingRequests[0].passenger?.rating || '4.5'}</span>
                  </div>
                </div>

                {/* Ride Details */}
                <div className="ride-details-section">
                  <div className="ride-info-row">
                    <div className="ride-info-item">
                      <Car size={16} />
                      <span>{pendingRequests[0].vehicleType || 'Standard'}</span>
                    </div>
                    <div className="ride-info-item">
                      <Clock size={16} />
                      <span>{pendingRequests[0].estimatedTime || '15 mins'}</span>
                    </div>
                    <div className="ride-info-item">
                      <Navigation size={16} />
                      <span>{pendingRequests[0].distance || '5.2 km'}</span>
                    </div>
                  </div>
                </div>

                <div className="route-section-premium">
                  <div className="route-point">
                    <div className="point-dot"></div>
                    <span className="point-label">Pickup Location</span>
                    <p className="point-address">{pendingRequests[0].pickupLocation?.address || 'Pickup address'}</p>
                  </div>
                  <div className="route-point">
                    <div className="point-dot dropoff"></div>
                    <span className="point-label">Dropoff Location</span>
                    <p className="point-address">{pendingRequests[0].dropoffLocation?.address || 'Dropoff address'}</p>
                  </div>
                </div>

                <div className="action-buttons-group">
                  <button className="btn-deny" onClick={() => denyRide(pendingRequests[0]._id)}>
                    <X size={18} />
                    Decline
                  </button>
                  <button className="btn-accept" onClick={() => acceptRide(pendingRequests[0]._id)}>
                    <CheckCircle size={18} />
                    Accept Ride
                  </button>
                </div>
              </div>
            )}

            {/* Active Ride */}
            {activeRide && (
              <div className="active-ride-card">
                <div className="card-header-premium">
                  <span className="request-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
                    Active Trip • {activeRide.status.toUpperCase()}
                  </span>
                  <div className="fare-tag">{activeRide.fare.total} RWF</div>
                </div>

                <div className="active-passenger-summary">
                  <div className="passenger-avatar-mini">
                    {activeRide.passenger?.name?.charAt(0)}
                  </div>
                  <div className="passenger-info">
                    <h4>{activeRide.passenger?.name}</h4>
                    <p>Passenger • 4.8 ★</p>
                  </div>
                  <div className="passenger-contact-actions">
                    <button className="contact-btn" onClick={() => toast.success('Calling passenger...')}><Phone size={18} /></button>
                    <button className="contact-btn" onClick={() => toast.success('Opening chat...')}><MessageCircle size={18} /></button>
                  </div>
                </div>

                <div className="status-scroll-actions">
                  {activeRide.status === 'accepted' && (
                    <button className="btn-status-update arrived" onClick={() => updateRideStatus('arrived')}>
                      Confirm Arrival
                    </button>
                  )}
                  {activeRide.status === 'arrived' && (
                    <button className="btn-status-update start" onClick={() => updateRideStatus('started')}>
                      Start Trip
                    </button>
                  )}
                  {activeRide.status === 'started' && (
                    <button className="btn-status-update complete" onClick={() => updateRideStatus('completed')}>
                      Complete Trip
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
