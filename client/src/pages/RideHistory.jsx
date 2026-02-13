import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Star, User, Car, Filter, Search, Download, Receipt } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './RideHistory.css';

const RideHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
      // Mock data for demonstration
      setRides(getMockRideData());
    } finally {
      setLoading(false);
    }
  };

  const getMockRideData = () => [
    {
      _id: '1',
      status: 'completed',
      pickupLocation: { address: '123 Main St, New York, NY' },
      dropoffLocation: { address: '456 Broadway, New York, NY' },
      fare: { total: 25.50, base: 3.00, distance: 22.50, tip: 0 },
      distance: 8.5,
      duration: 25,
      vehicleType: 'economy',
      driver: {
        name: 'John Smith',
        avatar: 'https://via.placeholder.com/50',
        driverDetails: {
          vehicleModel: 'Toyota Camry',
          vehicleColor: 'Silver',
          vehiclePlate: 'ABC 123'
        }
      },
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:55:00Z',
      rating: 5,
      paymentMethod: 'credit_card'
    },
    {
      _id: '2',
      status: 'completed',
      pickupLocation: { address: '789 5th Ave, New York, NY' },
      dropoffLocation: { address: '321 Park Ave, New York, NY' },
      fare: { total: 18.75, base: 3.00, distance: 15.75, tip: 2.00 },
      distance: 6.2,
      duration: 18,
      vehicleType: 'premium',
      driver: {
        name: 'Sarah Johnson',
        avatar: 'https://via.placeholder.com/50',
        driverDetails: {
          vehicleModel: 'BMW 5 Series',
          vehicleColor: 'Black',
          vehiclePlate: 'XYZ 789'
        }
      },
      createdAt: '2024-01-14T14:20:00Z',
      completedAt: '2024-01-14T14:38:00Z',
      rating: 4,
      paymentMethod: 'cash'
    },
    {
      _id: '3',
      status: 'cancelled',
      pickupLocation: { address: '555 Times Square, New York, NY' },
      dropoffLocation: { address: '999 Central Park, New York, NY' },
      fare: { total: 0, base: 0, distance: 0, tip: 0 },
      distance: 0,
      duration: 0,
      vehicleType: 'suv',
      driver: null,
      createdAt: '2024-01-13T09:15:00Z',
      cancelledAt: '2024-01-13T09:20:00Z',
      cancellationReason: 'Cancelled by passenger'
    }
  ];

  const filteredRides = rides.filter(ride => {
    const matchesSearch = searchTerm === '' ||
      ride.pickupLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoffLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || ride.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
    setShowDetails(true);
  };

  const handleDownloadReceipt = async (rideId) => {
    try {
      const response = await api.get(`/rides/${rideId}/receipt`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${rideId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

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

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      cancelled: 'danger',
      pending: 'warning',
      accepted: 'info',
      started: 'info'
    };
    return colors[status] || 'info';
  };

  const getVehicleIcon = (type) => {
    const icons = {
      economy: '🚗',
      premium: '🚙',
      suv: '🚐',
      bike: '🏍️'
    };
    return icons[type] || '🚗';
  };

  if (loading) {
    return (
      <div className="ride-history-page loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="ride-history-page">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/passenger/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Ride History</h1>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-number">{rides.filter(r => r.status === 'completed').length}</div>
            <div className="stat-label">Total Rides</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">${rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fare.total, 0).toFixed(2)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by location, driver name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          {['all', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rides-list">
        {filteredRides.length === 0 ? (
          <div className="empty-state">
            <Car size={48} className="empty-icon" />
            <h3>No rides found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredRides.map(ride => (
            <div key={ride._id} className="ride-card" onClick={() => handleRideClick(ride)}>
              <div className="ride-header">
                <div className="ride-date">
                  <Calendar size={16} />
                  <span>{formatDate(ride.createdAt)}</span>
                  <Clock size={16} />
                  <span>{formatTime(ride.createdAt)}</span>
                </div>
                <div className={`status-badge status-${getStatusColor(ride.status)}`}>
                  {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                </div>
              </div>

              <div className="ride-route">
                <div className="route-point">
                  <MapPin size={16} className="pickup-icon" />
                  <span className="address">{ride.pickupLocation?.address}</span>
                </div>
                <div className="route-line"></div>
                <div className="route-point">
                  <MapPin size={16} className="dropoff-icon" />
                  <span className="address">{ride.dropoffLocation?.address}</span>
                </div>
              </div>

              <div className="ride-details">
                <div className="detail-item">
                  <span className="vehicle-icon">{getVehicleIcon(ride.vehicleType)}</span>
                  <span className="vehicle-type capitalize">{ride.vehicleType}</span>
                </div>

                {ride.driver && (
                  <div className="detail-item">
                    <User size={16} />
                    <span>{ride.driver.name}</span>
                    {ride.rating && (
                      <div className="rating">
                        <Star size={14} className="star-filled" />
                        <span>{ride.rating}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="detail-item price">
                  <DollarSign size={16} />
                  <span className="fare-amount">${ride.fare.total.toFixed(2)}</span>
                </div>
              </div>

              {ride.status === 'completed' && (
                <div className="ride-actions">
                  <button
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadReceipt(ride._id);
                    }}
                  >
                    <Receipt size={16} />
                    Download Receipt
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Ride Details Modal */}
      {showDetails && selectedRide && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ride Details</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Trip Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Date:</label>
                    <span>{formatDate(selectedRide.createdAt)} at {formatTime(selectedRide.createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className={`status-badge status-${getStatusColor(selectedRide.status)}`}>
                      {selectedRide.status.charAt(0).toUpperCase() + selectedRide.status.slice(1)}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Vehicle Type:</label>
                    <span className="capitalize">{selectedRide.vehicleType}</span>
                  </div>
                  <div className="info-item">
                    <label>Distance:</label>
                    <span>{selectedRide.distance} km</span>
                  </div>
                  <div className="info-item">
                    <label>Duration:</label>
                    <span>{selectedRide.duration} minutes</span>
                  </div>
                  <div className="info-item">
                    <label>Payment Method:</label>
                    <span className="capitalize">{selectedRide.paymentMethod?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Route</h3>
                <div className="route-details">
                  <div className="route-point-detail">
                    <MapPin size={20} className="pickup-icon" />
                    <div>
                      <label>Pickup</label>
                      <p>{selectedRide.pickupLocation?.address}</p>
                    </div>
                  </div>
                  <div className="route-point-detail">
                    <MapPin size={20} className="dropoff-icon" />
                    <div>
                      <label>Dropoff</label>
                      <p>{selectedRide.dropoffLocation?.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRide.driver && (
                <div className="detail-section">
                  <h3>Driver Information</h3>
                  <div className="driver-info">
                    <img
                      src={selectedRide.driver.avatar}
                      alt={selectedRide.driver.name}
                      className="driver-avatar"
                    />
                    <div className="driver-details">
                      <h4>{selectedRide.driver.name}</h4>
                      <p>{selectedRide.driver.driverDetails?.vehicleColor} {selectedRide.driver.driverDetails?.vehicleModel}</p>
                      <p>Plate: {selectedRide.driver.driverDetails?.vehiclePlate}</p>
                      {selectedRide.rating && (
                        <div className="rating-detail">
                          <Star size={16} className="star-filled" />
                          <span>{selectedRide.rating} / 5</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Fare Breakdown</h3>
                <div className="fare-breakdown">
                  <div className="fare-item">
                    <label>Base Fare:</label>
                    <span>${selectedRide.fare.base.toFixed(2)}</span>
                  </div>
                  <div className="fare-item">
                    <label>Distance ({selectedRide.distance} km):</label>
                    <span>${selectedRide.fare.distance.toFixed(2)}</span>
                  </div>
                  {selectedRide.fare.tip > 0 && (
                    <div className="fare-item">
                      <label>Tip:</label>
                      <span>${selectedRide.fare.tip.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="fare-item total">
                    <label>Total:</label>
                    <span>${selectedRide.fare.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedRide.status === 'completed' && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownloadReceipt(selectedRide._id)}
                >
                  <Download size={16} />
                  Download Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideHistory;
