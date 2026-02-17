import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Navigation, Menu } from 'lucide-react';
import DriverSidebar from '../components/DriverSidebar';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './RideHistory.css';

const RideHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const handleBack = () => {
    navigate(user?.role === 'driver' ? '/driver/dashboard' : '/passenger/dashboard');
  };

  const handleRideClick = (rideId) => {
    navigate(`/${user?.role || 'passenger'}/ride-details/${rideId}`);
  };

  if (loading) {
    return (
      <div className="ride-history-loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{display:"flex",height:"100vh",background:"#f4f6f8",overflow:"hidden"}}>
      {user?.role === 'driver' && (
        <DriverSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPage="history" />
      )}

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div className="ride-history-new">
      <div className="history-header">
        <button className="back-btn-round" onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
        {user?.role === 'driver' && (
          <button
            className="back-btn-round"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{marginLeft: '8px'}}
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="history-title">Ride History</h1>

        <div className="history-summary">
          <div className="summary-item">
            <span className="summary-value">{totalRides}</span>
            <span className="summary-label">TOTAL {user?.role === 'driver' ? 'TRIPS' : 'RIDES'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">${totalSpent}</span>
            <span className="summary-label">TOTAL {user?.role === 'driver' ? 'EARNED' : 'SPENT'}</span>
          </div>
        </div>
      </div>


      <div className="search-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0'
      }}>
        <div className="search-wrapper" style={{
          maxWidth: '500px',
          width: '100%'
        }}>
          <Search size={18} className="search-icon-dim" />
          <input
            type="text"
            placeholder="Search by location..."
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
            onClick={() => handleRideClick(ride._id)}
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            textAlign: 'center',
            minHeight: '400px'
          }}>
            {/* Illustration */}
            <div style={{
              width: '200px',
              height: '200px',
              marginBottom: '24px',
              opacity: 0.9
            }}>
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Road */}
                <path d="M20 120 Q100 100 180 120" stroke="#e2e8f0" strokeWidth="40" strokeLinecap="round"/>
                <path d="M30 120 L50 120 M70 118 L90 118 M110 116 L130 116 M150 118 L170 118"
                      stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 10"/>

                {/* Car */}
                <g transform="translate(70, 70)">
                  {/* Car body */}
                  <rect x="0" y="20" width="60" height="25" rx="4" fill="#22c55e"/>
                  <rect x="10" y="10" width="40" height="15" rx="3" fill="#16a34a"/>

                  {/* Windows */}
                  <rect x="12" y="12" width="15" height="10" rx="2" fill="#dcfce7" opacity="0.6"/>
                  <rect x="33" y="12" width="15" height="10" rx="2" fill="#dcfce7" opacity="0.6"/>

                  {/* Wheels */}
                  <circle cx="15" cy="45" r="6" fill="#1f2937"/>
                  <circle cx="15" cy="45" r="3" fill="#6b7280"/>
                  <circle cx="45" cy="45" r="6" fill="#1f2937"/>
                  <circle cx="45" cy="45" r="3" fill="#6b7280"/>

                  {/* Headlights */}
                  <circle cx="58" cy="28" r="2" fill="#fef3c7"/>
                  <circle cx="58" cy="37" r="2" fill="#fef3c7"/>
                </g>

                {/* Dust clouds */}
                <circle cx="40" cy="140" r="8" fill="#f1f5f9" opacity="0.6"/>
                <circle cx="50" cy="145" r="6" fill="#f1f5f9" opacity="0.4"/>
                <circle cx="160" cy="140" r="8" fill="#f1f5f9" opacity="0.6"/>
                <circle cx="150" cy="145" r="6" fill="#f1f5f9" opacity="0.4"/>
              </svg>
            </div>

            {/* Message */}
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '12px',
              margin: 0
            }}>
              No Rides Yet
            </h3>

            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '32px',
              maxWidth: '400px',
              lineHeight: '1.6'
            }}>
              {searchTerm
                ? `No rides found matching "${searchTerm}". Try a different search term.`
                : user?.role === 'driver'
                  ? "You haven't completed any trips yet. Start driving to build your ride history!"
                  : "You haven't taken any rides yet. Book your first ride to get started!"
              }
            </p>

            {/* Action Button */}
            <button
              onClick={() => navigate(user?.role === 'driver' ? '/driver/dashboard' : '/passenger/dashboard')}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;
