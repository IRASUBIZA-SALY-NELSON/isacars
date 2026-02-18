import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, DollarSign, Clock, Star, LogOut, User, History, Menu, X, Car } from 'lucide-react';
import api from '../utils/api';
import socketService from '../services/socket';
import MapComponent from '../components/MapComponent';
import toast from 'react-hot-toast';
import './PassengerDashboard.css';

const PassengerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [showBooking, setShowBooking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    vehicleType: 'economy',
    paymentMethod: 'cash'
  });
  const [fareEstimate, setFareEstimate] = useState(null);

  useEffect(() => {
    fetchActiveRide();
    fetchRideHistory();
    setupSocketListeners();

    return () => {
      socketService.off('rideAccepted');
      socketService.off('rideStatusUpdated');
      socketService.off('rideCancelled');
    };
  }, []);

  const setupSocketListeners = () => {
    socketService.on('rideAccepted', (ride) => {
      setActiveRide(ride);
      toast.success('Driver accepted your ride!');
    });

    socketService.on('rideStatusUpdated', (ride) => {
      setActiveRide(ride);
      if (ride.status === 'arrived') {
        toast.success('Driver has arrived!');
      } else if (ride.status === 'started') {
        toast.success('Ride started!');
      } else if (ride.status === 'completed') {
        toast.success('Ride completed!');
        setActiveRide(null);
        fetchRideHistory();
      }
    });

    socketService.on('rideCancelled', (ride) => {
      setActiveRide(null);
      toast.error('Ride was cancelled');
    });
  };

  const fetchActiveRide = async () => {
    try {
      const response = await api.get('/rides/active');
      if (response.data.ride) {
        setActiveRide(response.data.ride);
        setShowBooking(false);
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

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateFare = () => {
    // Simulate fare calculation
    const distance = Math.random() * 10 + 2; // 2-12 km
    const duration = Math.random() * 30 + 10; // 10-40 minutes

    const baseFares = {
      economy: 3,
      premium: 5,
      suv: 7,
      bike: 2
    };

    const perKmRates = {
      economy: 1.5,
      premium: 2.5,
      suv: 3,
      bike: 1
    };

    const baseFare = baseFares[bookingData.vehicleType];
    const distanceFare = distance * perKmRates[bookingData.vehicleType];
    const total = baseFare + distanceFare;

    setFareEstimate({
      distance: distance.toFixed(1),
      duration: Math.round(duration),
      total: total.toFixed(2)
    });
  };

  const handleBookRide = async (e) => {
    e.preventDefault();

    if (!bookingData.pickupAddress || !bookingData.dropoffAddress) {
      toast.error('Please enter pickup and dropoff locations');
      return;
    }

    setLoading(true);

    try {
      // Simulate coordinates (NYC area for realism)
      // [Longitude, Latitude] - GeoJSON format
      const centerLng = -74.0060;
      const centerLat = 40.7128;

      const pickupCoords = [
        centerLng + (Math.random() - 0.5) * 0.1, // +/- ~5km
        centerLat + (Math.random() - 0.5) * 0.1
      ];

      const dropoffCoords = [
        centerLng + (Math.random() - 0.5) * 0.1,
        centerLat + (Math.random() - 0.5) * 0.1
      ];

      const distance = Math.random() * 10 + 2;
      const duration = Math.random() * 30 + 10;

      const response = await api.post('/rides', {
        pickupLocation: {
          address: bookingData.pickupAddress,
          coordinates: {
            type: 'Point',
            coordinates: pickupCoords
          }
        },
        dropoffLocation: {
          address: bookingData.dropoffAddress,
          coordinates: {
            type: 'Point',
            coordinates: dropoffCoords
          }
        },
        vehicleType: bookingData.vehicleType,
        distance,
        duration,
        paymentMethod: bookingData.paymentMethod
      });

      setActiveRide(response.data.ride);
      setShowBooking(false);
      toast.success('Ride requested! Finding a driver...');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book ride');
    }

    setLoading(false);
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;

    try {
      await api.put(`/rides/${activeRide._id}/cancel`, {
        reason: 'Cancelled by passenger'
      });
      setActiveRide(null);
      setShowBooking(true);
      toast.success('Ride cancelled');
    } catch (error) {
      toast.error('Failed to cancel ride');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="passenger-dashboard">
      {/* Full Screen Map */}
      <div className="map-view-container">
        <MapComponent
            status={activeRide?.status}
            pickup={activeRide?.pickupLocation}
            dropoff={activeRide?.dropoffLocation}
            driver={activeRide?.driver?.driverDetails?.currentLocation}
        />
      </div>

      {/* Header with Hamburger */}
      <header className="app-header">
        <button className="menu-trigger" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar Drawer */}
      <div className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', padding: '10px 0 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
            <img src="/logo.png" alt="Nova Transport Logo" style={{ height: '32px', width: 'auto' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827', margin: 0 }}>Nova Transport</h2>
          </div>
          <div className="user-profile-summary">
            <div className="profile-avatar">
              <User size={24} />
            </div>
            <div className="profile-info">
              <h3>{user?.name}</h3>
              <p>Passenger</p>
            </div>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/passenger/ride-history')}>
            <History size={20} />
            <span>Ride History</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/passenger/wallet')}>
            <DollarSign size={20} />
            <span>Wallet / Payment</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/passenger/rewards')}>
            <Star size={20} />
            <span>Rewards</span>
          </div>
        </div>

        <div className="sidebar-footer" style={{marginTop: 'auto', borderTop: '1px solid #eee', padding: '20px'}}>
          <div className="menu-item" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Log Out</span>
          </div>
        </div>
      </div>

      {/* Floating Panel (Booking / Active Ride) */}
      <div className="floating-panel">

        {/* Booking Form */}
        {showBooking && !activeRide && (
          <div className="panel-card booking-form">
            <h2 className="mb-3 text-lg font-bold">Where to?</h2>

            <form onSubmit={handleBookRide}>
              <div className="input-group">
                <MapPin className="input-icon" size={18} color="green" />
                <input
                  type="text"
                  name="pickupAddress"
                  className="panel-input"
                  placeholder="Pickup Location"
                  value={bookingData.pickupAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <Navigation className="input-icon" size={18} color="red" />
                <input
                  type="text"
                  name="dropoffAddress"
                  className="panel-input"
                  placeholder="Dropoff Location"
                  value={bookingData.dropoffAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="vehicle-selector">
                {['economy', 'premium', 'suv', 'bike'].map(type => (
                  <div
                    key={type}
                    className={`vehicle-option ${bookingData.vehicleType === type ? 'selected' : ''}`}
                    onClick={() => setBookingData({...bookingData, vehicleType: type})}
                  >
                    <span className="vehicle-emoji">
                      {type === 'economy' && '🚗'}
                      {type === 'premium' && '🚙'}
                      {type === 'suv' && '🚐'}
                      {type === 'bike' && '🏍️'}
                    </span>
                    <span className="vehicle-name capitalize">{type}</span>
                  </div>
                ))}
              </div>

              {fareEstimate ? (
                 <div className="fare-display">
                    <div>
                        <div className="text-xs text-gray-500">Estimate</div>
                        <div className="fare-value">${fareEstimate.total}</div>
                    </div>
                    <div>
                         <div className="text-xs text-gray-500">Time</div>
                         <div className="font-bold">{fareEstimate.duration} min</div>
                    </div>
                 </div>
              ) : (
                <button type="button" className="btn btn-secondary w-full mb-3 py-2 rounded-lg" onClick={calculateFare}>
                    See Price Estimate
                </button>
              )}

              <button type="submit" className="btn btn-primary w-full py-3 text-lg font-bold rounded-lg shadow-lg" disabled={loading}>
                {loading ? 'Requesting...' : 'Request Ride'}
              </button>
            </form>
          </div>
        )}

        {/* Active Ride Card */}
        {activeRide && (
           <div className="panel-card active-ride">
              <div className="flex justify-between items-center mb-4">
                  <div className={`badge badge-${getStatusColor(activeRide.status)}`}>
                    {activeRide.status === 'pending' ? 'Finding Driver...' : activeRide.status}
                  </div>
                  <div className="font-bold text-xl">${activeRide.fare.total}</div>
              </div>

              {activeRide.driver && (
                  <div className="driver-pill">
                      <img
                        src={activeRide.driver.avatar || 'https://via.placeholder.com/50'}
                        alt="Driver"
                        className="driver-avatar-sm"
                      />
                      <div>
                          <div className="font-bold text-lg">{activeRide.driver.name}</div>
                          <div className="text-sm text-gray-500">
                             {activeRide.driver.driverDetails?.vehicleColor} {activeRide.driver.driverDetails?.vehicleModel} ● {activeRide.driver.driverDetails?.vehiclePlate}
                          </div>
                      </div>
                  </div>
              )}

              <div className="input-group mb-2">
                 <div className="text-xs text-gray-500 ml-1 mb-1">Destination</div>
                 <div className="font-bold ml-1">{activeRide.dropoffLocation.address}</div>
              </div>

              {activeRide.status !== 'completed' && activeRide.status !== 'cancelled' && (
                  <button className="btn btn-danger w-full py-3 rounded-lg mt-2" onClick={handleCancelRide}>
                      Cancel Ride
                  </button>
              )}
           </div>
        )}

        {/* Ride History (Only shown if sidebar open? No, keep it in sidebar) */}
      </div>

    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    accepted: 'info',
    arrived: 'info',
    started: 'success',
    completed: 'success',
    cancelled: 'danger'
  };
  return colors[status] || 'info';
};

export default PassengerDashboard;
