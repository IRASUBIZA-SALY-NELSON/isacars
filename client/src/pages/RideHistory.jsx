import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Navigation } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './RideHistory.css';

const RideHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rides/history');
      setRides(response.data.rides || []);
    } catch (error) {
      console.error('Error fetching ride history:', error);
      toast.error('Failed to load ride history');
      // Fallback mock data
      setRides(getMockRideData());
    } finally {
      setLoading(false);
    }
  };

  const getMockRideData = () => [
    {
      _id: '1',
      status: 'completed',
      pickupLocation: { address: 'kigali' },
      dropoffLocation: { address: 'gisenyi' },
      fare: { total: 20.48 },
      createdAt: '2026-02-13T10:34:00Z',
    },
    {
      _id: '2',
      status: 'completed',
      pickupLocation: { address: 'kingogo' },
      dropoffLocation: { address: 'mukamira' },
      fare: { total: 16.56 },
      createdAt: '2026-02-13T10:21:00Z',
    }
  ];

  const filteredRides = rides.filter(ride => {
    return searchTerm === '' ||
      ride.pickupLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoffLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalRides = rides.filter(r => r.status === 'completed').length;
  const totalSpent = rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fare.total, 0).toFixed(2);

  if (loading) {
    return (
      <div className="ride-history-loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="ride-history-new">
      <div className="history-header">
        <button className="back-btn-round" onClick={() => navigate('/passenger/dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="history-title">Ride History</h1>

        <div className="history-summary">
          <div className="summary-item">
            <span className="summary-value">{totalRides}</span>
            <span className="summary-label">TOTAL RIDES</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">${totalSpent}</span>
            <span className="summary-label">TOTAL SPENT</span>
          </div>
        </div>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <Search size={18} className="search-icon-dim" />
          <input
            type="text"
            placeholder="Search by location, driver name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rides-container">
        {filteredRides.map((ride, index) => (
          <div
            key={ride._id}
            className={`ride-item-card ${index === 0 ? 'highlight-border' : ''}`}
            onClick={() => navigate(`/passenger/ride-details/${ride._id}`)}
          >
            <div className="ride-loc-info">
              <div className="loc-row">
                <div className="loc-dot pickup-dot"></div>
                <span className="loc-text">{ride.pickupLocation?.address}</span>
              </div>
              <div className="loc-line"></div>
              <div className="loc-row">
                <Navigation size={14} className="loc-arrow" />
                <span className="loc-text">{ride.dropoffLocation?.address}</span>
              </div>
            </div>

            <div className="ride-meta-info">
              <div className="time-info">
                <span className="meta-date">{formatDate(ride.createdAt)}</span>
                <span className="meta-time">{formatTime(ride.createdAt)}</span>
              </div>
              <div className="price-info">
                <span className="price-value">${ride.fare?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredRides.length === 0 && (
          <div className="empty-history">
            <p>No ride history found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistory;
