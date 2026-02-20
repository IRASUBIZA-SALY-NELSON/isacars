import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Phone, MessageCircle, MoreVertical, CreditCard, ChevronUp } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './RideDetails.css';

const RideDetails = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRideDetails();
  }, [rideId]);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/rides/${rideId}`);
      if (response.data.success) {
        setRide(response.data.ride);
      } else {
        toast.error('Ride not found');
      }
    } catch (error) {
      console.error('Error fetching ride details:', error);
      toast.error('Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };



  const handleBack = () => {
     if (user?.role === 'driver') {
         navigate('/driver/history');
     } else {
         navigate('/passenger/ride-history');
     }
  };

  if (loading) {
    return (
      <div className="ride-details-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="ride-details-error">
        <div className="error-card">
          <h2>Ride Not Found</h2>
          <p>We couldn't find the details for this ride. It might have been deleted or never existed.</p>
          <button onClick={handleBack} className="btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ride-details-page">
      <div className="details-header">
        <button className="back-btn-round" onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="map-view-container">
        <MapComponent
          pickup={ride.pickupLocation}
          dropoff={ride.dropoffLocation}
          className="details-map"
        />

        {/* Floating Destination Box on Map */}
        <div className="floating-dest-card">
          <div className="dest-icon-bg">
            <div className="dest-dot"></div>
          </div>
          <div className="dest-info">
            <span className="dest-label">Destination</span>
            <span className="dest-addr">{ride.dropoffLocation?.address}</span>
          </div>
        </div>
      </div>

      <div className="bottom-sheet">
        <div className="sheet-handle"></div>

        <div className="status-timer">
          <span className="status-text capitalize">{ride.status.replace('_', ' ')}</span>
          <span className="timer-val">00:05:20</span>
        </div>

        <div className="driver-profile-card">
          <div className="driver-avatar-main">
            <img src={ride.driver?.avatar || 'https://via.placeholder.com/50'} alt="driver" />
          </div>
          <div className="driver-details-main">
            <h3 className="driver-name-main">{ride.driver?.name || 'Searching...'}</h3>
            <p className="vehicle-info-main">
              {ride.driver?.driverDetails?.vehicleModel} • {ride.driver?.driverDetails?.vehiclePlate}
            </p>
          </div>
          <div className="driver-actions-main">
            <button className="action-circle-btn" onClick={() => toast.success('Dialing driver...')}>
              <Phone size={20} />
            </button>
            <button className="action-circle-btn" onClick={() => toast.success('Opening chat with driver...')}>
              <MessageCircle size={20} />
            </button>
          </div>
        </div>

        <div className="route-addresses">
          <div className="addr-item">
            <div className="addr-icon pickup-circle"></div>
            <div className="addr-content">
              <span className="addr-val">{ride.pickupLocation?.address}</span>
              <span className="addr-lbl">Pickup point</span>
            </div>
          </div>
          <div className="vertical-dotted-line"></div>
          <div className="addr-item">
            <div className="addr-icon dest-circle"></div>
            <div className="addr-content">
              <span className="addr-val">{ride.dropoffLocation?.address}</span>
              <span className="addr-lbl">Destination</span>
            </div>
          </div>
        </div>

        <div className="payment-method-card" onClick={() => toast('Payment verified under secure encryption.', { icon: '🛡️' })}>
          <div className="pm-icon-bg">
            <CreditCard size={20} />
          </div>
          <div className="pm-info">
            <span className="pm-number">**** 7493</span>
            <span className="pm-type">Credit card</span>
          </div>
          <div className="pm-arrow">
            <ChevronUp size={20} />
          </div>
        </div>

        <div className="fare-footer">
          <span className="total-label">Total Fare</span>
          <span className="total-value">{ride.fare?.total?.toLocaleString()} RWF</span>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
