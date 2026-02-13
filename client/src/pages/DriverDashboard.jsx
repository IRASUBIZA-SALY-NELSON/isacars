import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Star,
  LogOut,
  User,
  Menu,
  X,
  History,
  TrendingUp,
  Car
} from 'lucide-react';
import api from '../utils/api';
import socketService from '../services/socket';
import MapComponent from '../components/MapComponent';
import toast from 'react-hot-toast';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(user?.driverDetails?.isAvailable || false);
  const [activeRide, setActiveRide] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [rideHistory, setRideHistory] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchActiveRide();
    fetchRideHistory();
    fetchEarnings();
    setupSocketListeners();
    startLocationTracking();

    return () => {
      socketService.off('newRideRequest');
      socketService.off('rideStatusUpdated');
      socketService.off('rideCancelled');
    };
  }, []);

  const setupSocketListeners = () => {
    socketService.on('newRideRequest', (ride) => {
      if (isAvailable && !activeRide) {
        toast.success('New ride request!');
        setPendingRequests((prev) => [...prev, ride]);
      }
    });

    socketService.on('rideStatusUpdated', (ride) => {
      if (ride.driver?._id === user?.id || ride.driver === user?.id) {
        setActiveRide(ride);
      }
    });

    socketService.on('rideCancelled', (ride) => {
      if (ride.driver?._id === user?.id || ride.driver === user?.id) {
        setActiveRide(null);
        toast.error('Ride was cancelled by passenger');
      }
      setPendingRequests((prev) => prev.filter((r) => r._id !== ride._id));
    });
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          updateDriverLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  const updateDriverLocation = async (latitude, longitude) => {
    try {
      await api.put('/drivers/location', { latitude, longitude });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const fetchActiveRide = async () => {
    try {
      const response = await api.get('/rides/active');
      if (response.data.ride) {
        setActiveRide(response.data.ride);
      }
    } catch (error) {
      console.error('Error fetching active ride:', error);
    }
  };

  const fetchRideHistory = async () => {
    try {
      const response = await api.get('/rides/history');
      setRideHistory(response.data.rides);
    } catch (error) {
      console.error('Error fetching ride history:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/drivers/earnings');
      setEarnings(response.data.earnings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !isAvailable;
      await api.put('/drivers/availability', { isAvailable: newStatus });
      setIsAvailable(newStatus);

      const updatedUser = { ...user };
      updatedUser.driverDetails.isAvailable = newStatus;
      updateUser(updatedUser);

      toast.success(newStatus ? 'You are now online' : 'You are now offline');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const acceptRide = async (rideId) => {
    try {
      const response = await api.put(`/rides/${rideId}/accept`);
      setActiveRide(response.data.ride);
      setPendingRequests([]);
      setIsAvailable(false);
      toast.success('Ride accepted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept ride');
    }
  };

  const updateRideStatus = async (status) => {
    if (!activeRide) return;

    try {
      const response = await api.put(`/rides/${activeRide._id}/status`, { status });
      setActiveRide(response.data.ride);
      toast.success(`Ride ${status}`);

      if (status === 'completed') {
        setActiveRide(null);
        setIsAvailable(true);
        fetchRideHistory();
        fetchEarnings();
      }
    } catch (error) {
      toast.error('Failed to update ride status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="driver-dashboard">
      {/* Full Screen Map */}
      <div className="map-view-container">
        <MapComponent
            pickup={activeRide?.pickupLocation}
            dropoff={activeRide?.dropoffLocation}
            driver={activeRide?.driver?.driverDetails?.currentLocation}
        />
      </div>

      {/* Floating Header */}
      <header className="app-header">
        <button className="menu-trigger" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="status-indicator">
          <span className={`status-dot ${isAvailable ? 'online' : 'offline'}`}></span>
          {isAvailable ? 'Online' : 'Offline'}
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar Drawer */}
      <div className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-profile-summary">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <div className="profile-info">
              <h3>{user?.name}</h3>
              <p>Driver Account</p>
            </div>
          </div>
          <div className="sidebar-stats">
            <div className="mini-stat">
              <span className="mini-stat-value">{earnings?.rating || 5.0}</span>
              <span className="mini-stat-label">Rating</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">{earnings?.totalRides || 0}</span>
              <span className="mini-stat-label">Trips</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">${earnings?.total || 0}</span>
              <span className="mini-stat-label">Earned</span>
            </div>
          </div>
          <button
            className={`toggle-availability-btn ${isAvailable ? 'active' : ''}`}
            onClick={toggleAvailability}
          >
            {isAvailable ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item">
            <TrendingUp size={20} />
            <span>Earnings</span>
          </div>
          <div className="menu-item">
            <History size={20} />
            <span>Trip History</span>
          </div>
          <div className="menu-item">
            <Car size={20} />
            <span>Vehicle Info</span>
          </div>
          <div className="menu-item">
            <User size={20} />
            <span>Profile</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="menu-item" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log Out</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Sheet */}
      <div className="bottom-panel">

        {/* Ride Requests */}
        {pendingRequests.length > 0 && !activeRide && (
          <div className="action-card request-card">
            <h3>New Ride Request!</h3>
            <div className="request-details">
              <div className="d-flex justify-between mb-2">
                <span>Fare</span>
                <span className="text-xl font-bold text-success">${pendingRequests[0].fare.total}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Pickup:</strong> {pendingRequests[0].pickupLocation.address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Dropoff:</strong> {pendingRequests[0].dropoffLocation.address}
              </p>
            </div>
            <button
              className="btn btn-primary btn-accept"
              onClick={() => acceptRide(pendingRequests[0]._id)}
            >
              Accept Ride
            </button>
          </div>
        )}

        {/* Active Ride Controls */}
        {activeRide && (
          <div className="action-card active-ride-card">
            <div className="d-flex justify-between items-center mb-3">
              <div className="badge badge-info">{activeRide.status}</div>
              <span className="font-bold text-xl">${activeRide.fare.total}</span>
            </div>

            <div className="passenger-compact mb-3">
              <div className="d-flex items-center gap-2">
                <div className="profile-avatar" style={{width: 40, height: 40, fontSize: '1rem'}}>
                    {activeRide.passenger?.name[0]}
                </div>
                <div>
                    <div className="font-bold">{activeRide.passenger?.name}</div>
                    <div className="text-sm text-gray-500">Passenger</div>
                </div>
              </div>
            </div>

            <div className="route-compact mb-3">
                <div className="text-sm mb-1">📍 <strong>To:</strong> {activeRide.dropoffLocation.address}</div>
            </div>

            <div className="ride-actions">
                {activeRide.status === 'accepted' && (
                  <button className="btn btn-primary btn-accept" onClick={() => updateRideStatus('arrived')}>
                    Confirmed Arrival
                  </button>
                )}
                {activeRide.status === 'arrived' && (
                  <button className="btn btn-success btn-accept" onClick={() => updateRideStatus('started')}>
                    Start Trip
                  </button>
                )}
                {activeRide.status === 'started' && (
                  <button className="btn btn-success btn-accept" onClick={() => updateRideStatus('completed')}>
                    Complete Trip
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
