import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Navigation, Menu, History, DollarSign, Clock } from 'lucide-react';
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
        <div className="header-top">
          <button className="back-btn-premium" onClick={handleBack}>
            <ArrowLeft size={24} />
          </button>
          <div className="header-text">
            <h1 className="history-title-premium">Ride History</h1>
            <p className="history-subtitle">View your past trips and details</p>
          </div>
          {user?.role === 'driver' && (
            <button
              className="back-btn-premium"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        <div className="history-summary-cards">
          <div className="summary-card-premium">
            <div className="card-icon blue"><History size={20} /></div>
            <div className="card-content">
              <span className="card-value">{totalRides}</span>
              <span className="card-label">Total {user?.role === 'driver' ? 'Trips' : 'Rides'}</span>
            </div>
          </div>
          <div className="summary-card-premium">
            <div className="card-icon green"><DollarSign size={20} /></div>
            <div className="card-content">
              <span className="card-value">${totalSpent}</span>
              <span className="card-label">Total {user?.role === 'driver' ? 'Earned' : 'Spent'}</span>
            </div>
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
            className="ride-card-premium animate-in fade-in"
            onClick={() => handleRideClick(ride._id)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="card-header-premium">
              <div className="ride-date-pill">
                <Clock size={12} />
                <span>{formatDate(ride.createdAt)} • {formatTime(ride.createdAt)}</span>
              </div>
              <div className="ride-price-badge">${ride.fare?.total?.toFixed(2)}</div>
            </div>

            <div className="ride-route-premium">
              <div className="route-indicator">
                <div className="route-dot pickup"></div>
                <div className="route-line-dashed"></div>
                <div className="route-dot destination"></div>
              </div>
              <div className="route-details">
                <div className="location-pill-premium">
                  <span className="loc-label">PICKUP</span>
                  <span className="loc-value">{ride.pickupLocation?.address}</span>
                </div>
                <div className="location-pill-premium">
                  <span className="loc-label">DESTINATION</span>
                  <span className="loc-value">{ride.dropoffLocation?.address}</span>
                </div>
              </div>
            </div>

            <div className="card-footer-premium">
              <span className={`status-pill ${ride.status}`}>{ride.status}</span>
              <button className="view-details-txt">View Details</button>
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
