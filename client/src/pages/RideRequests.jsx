import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Car, User, Clock, Navigation, DollarSign, Star, X, CheckCircle,
  ArrowLeft, MapPin, Phone, MessageCircle, Shield, Zap, Bike
} from 'lucide-react';
import api from '../utils/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';
import './RideRequests.css';

const RideRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(user?.driverDetails?.isAvailable || false);

  useEffect(() => {
    fetchPendingRequests();
    setupSocketListeners();

    return () => {
      socketService.off('newRideRequest');
      socketService.off('rideAccepted');
      socketService.off('rideCancelled');
    };
  }, []);

  const fetchPendingRequests = async () => {
    try {
      console.log('🔍 Fetching pending requests...');
      const response = await api.get('/rides/pending');
      console.log('📦 API Response:', response.data);
      setPendingRequests(response.data.requests || []);
      console.log('✅ Pending requests set:', response.data.requests?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching pending requests:', error);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('newRideRequest', (ride) => {
      if (isAvailable) {
        setPendingRequests(prev => [...prev, ride]);
        toast.success('New ride request received!', { icon: '🚖' });
      }
    });

    socketService.on('rideAccepted', (rideId) => {
      setPendingRequests(prev => prev.filter(r => r._id !== rideId));
    });

    socketService.on('rideCancelled', (rideId) => {
      setPendingRequests(prev => prev.filter(r => r._id !== rideId));
    });
  };

  const acceptRide = async (rideId) => {
    setLoading(true);
    try {
      const response = await api.put(`/rides/${rideId}/accept`);
      setPendingRequests(prev => prev.filter(r => r._id !== rideId));
      toast.success('Ride accepted! Check your dashboard for pickup details...', { icon: '🏁' });
      // Don't navigate away - stay on driver dashboard for real-time updates
    } catch (error) {
      toast.error('Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  const denyRide = (rideId) => {
    setPendingRequests(prev => prev.filter(r => r._id !== rideId));
    toast('Request ignored', { icon: '⏭️' });
  };

  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'economy': return <Car size={20} />;
      case 'premium': return <Zap size={20} />;
      case 'suv': return <Shield size={20} />;
      case 'bike': return <Bike size={20} />;
      default: return <Car size={20} />;
    }
  };

  return (
    <div className="ride-requests-page">
      <header className="requests-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/driver-dashboard')}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="header-title">
            <h1>Ride Requests</h1>
            <p>{pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="header-right">
          <div className={`availability-status ${isAvailable ? 'online' : 'offline'}`}>
            <div className="status-dot"></div>
            {isAvailable ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>

      <main className="requests-main">
        {pendingRequests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">
              <Car size={48} color="#94a3b8" />
            </div>
            <h3>No Ride Requests</h3>
            <p>When passengers request rides, they'll appear here</p>
            {isAvailable && (
              <p className="status-text">You're online and ready to receive requests</p>
            )}
          </div>
        ) : (
          <div className="requests-list">
            {pendingRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="card-header">
                  <div className="request-info">
                    <span className="request-badge">New Request</span>
                    <div className="fare-amount">{request.fare?.total || 0} RWF</div>
                  </div>
                  <div className="vehicle-type">
                    {getVehicleIcon(request.vehicleType)}
                    <span className="vehicle-name">{request.vehicleType?.charAt(0).toUpperCase() + request.vehicleType?.slice(1)}</span>
                  </div>
                </div>

                <div className="passenger-section">
                  <div className="passenger-info">
                    <div className="passenger-avatar">
                      {request.passenger?.avatar ? (
                        <img src={request.passenger.avatar} alt="Passenger" />
                      ) : (
                        <img src="/profile.jpeg" alt="Passenger" onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=Passenger';
                        }} />
                      )}
                    </div>
                    <div className="passenger-details">
                      <h4>{request.passenger?.name || 'Passenger'}</h4>
                      <div className="passenger-contact">
                        <Phone size={14} />
                        <span>{request.passenger?.phone || 'Phone not available'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="passenger-rating">
                    <Star size={16} className="star-icon" />
                    <span>{request.passenger?.passengerDetails?.rating || '4.5'}</span>
                  </div>
                </div>

                <div className="ride-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <Navigation size={16} />
                      <span>{request.distance || 'N/A'} km</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{request.duration || 'N/A'} min</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <span>{request.paymentMethod || 'Cash'}</span>
                    </div>
                  </div>
                </div>

                <div className="route-section">
                  <div className="route-point">
                    <div className="point-dot pickup"></div>
                    <div className="point-content">
                      <span className="point-label">Pickup</span>
                      <p className="point-address">{request.pickupLocation?.address || 'Pickup address'}</p>
                    </div>
                  </div>
                  <div className="route-line"></div>
                  <div className="route-point">
                    <div className="point-dot dropoff"></div>
                    <div className="point-content">
                      <span className="point-label">Dropoff</span>
                      <p className="point-address">{request.dropoffLocation?.address || 'Dropoff address'}</p>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn-deny"
                    onClick={() => denyRide(request._id)}
                    disabled={loading}
                  >
                    <X size={18} />
                    Decline
                  </button>
                  <button
                    className="btn-accept"
                    onClick={() => acceptRide(request._id)}
                    disabled={loading}
                  >
                    <CheckCircle size={18} />
                    Accept Ride
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RideRequests;
