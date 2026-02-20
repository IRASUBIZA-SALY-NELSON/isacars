import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, DollarSign, Clock, Star, LogOut, User, History, Menu, X, Car, Bike, Zap, Shield, Settings, HelpCircle, MessageCircle, AlertTriangle, Search, Route, Globe } from 'lucide-react';
import api from '../utils/api';
import socketService from '../services/socket';
import MapComponent from '../components/MapComponent';
import PassengerSidebar from '../components/PassengerSidebar';
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
  const [nearbyDriver, setNearbyDriver] = useState(null);

  // Interactive location search state
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);

  useEffect(() => {
    fetchActiveRide();
    fetchRideHistory();
    setupSocketListeners();

    let interval;
    if (activeRide?.status === 'pending') {
      // Simulate finding nearby drivers
      interval = setInterval(() => {
        const dummyDrivers = [
          { name: 'Jean-Paul', rating: 4.8, vehicle: 'Toyota Corolla', plate: 'RAE 123A', avatar: 'https://i.pravatar.cc/150?u=jp' },
          { name: 'Sylvie M.', rating: 4.9, vehicle: 'Hyundai Sonata', plate: 'RAD 456B', avatar: 'https://i.pravatar.cc/150?u=sm' },
          { name: 'Eric K.', rating: 4.7, vehicle: 'Volkswagen Golf', plate: 'RAC 789C', avatar: 'https://i.pravatar.cc/150?u=ek' }
        ];
        setNearbyDriver(dummyDrivers[Math.floor(Math.random() * dummyDrivers.length)]);
      }, 5000);
    } else {
      setNearbyDriver(null);
    }

    return () => {
      socketService.off('rideAccepted');
      socketService.off('rideStatusUpdated');
      socketService.off('rideCancelled');
      if (interval) clearInterval(interval);
    };
  }, [activeRide?.status]);

  const setupSocketListeners = () => {
    socketService.on('rideAccepted', (ride) => {
      setActiveRide(ride);
      toast.success('Great news! Driver accepted your ride!', { icon: '🚕' });
    });

    socketService.on('rideStatusUpdated', (ride) => {
      setActiveRide(ride);
      if (ride.status === 'arrived') {
        toast.success('Your driver has arrived at the location!', { icon: '📍', duration: 5000 });
      } else if (ride.status === 'started') {
        toast('Your journey has begun. Sit back and enjoy!', { icon: '🚀' });
      } else if (ride.status === 'completed') {
        toast.success('You have reached your destination!', { icon: '🏁' });
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
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });

    // Trigger location search
    if (name === 'pickupAddress' && value.length > 2) {
      searchLocations(value, 'pickup');
    } else if (name === 'dropoffAddress' && value.length > 2) {
      searchLocations(value, 'dropoff');
    }
  };

  // Mock location search function (replace with real API call)
  const searchLocations = async (query, type) => {
    setIsSearchingLocation(true);

    // Simulate API delay
    setTimeout(() => {
      const mockLocations = [
        { id: 1, name: 'Kigali City Center', address: 'Kigali, Rwanda', lat: -1.9441, lng: 30.0619 },
        { id: 2, name: 'Kigali International Airport', address: 'Kigali, Rwanda', lat: -1.9579, lng: 30.0606 },
        { id: 3, name: 'Kigali Convention Centre', address: 'Kigali, Rwanda', lat: -1.9431, lng: 30.0589 },
        { id: 4, name: 'Kimironko Market', address: 'Kigali, Rwanda', lat: -1.9369, lng: 30.1225 },
        { id: 5, name: 'Nyabugogo Bus Terminal', address: 'Kigali, Rwanda', lat: -1.9489, lng: 30.0585 },
        { id: 6, name: 'Remera Shopping Center', address: 'Kigali, Rwanda', lat: -1.9514, lng: 30.1113 },
        { id: 7, name: 'Kacyiru Police Station', address: 'Kigali, Rwanda', lat: -1.9278, lng: 30.0998 },
        { id: 8, name: 'Gisozi Genocide Memorial', address: 'Kigali, Rwanda', lat: -1.9636, lng: 30.0844 }
      ];

      const filtered = mockLocations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.address.toLowerCase().includes(query.toLowerCase())
      );

      if (type === 'pickup') {
        setPickupSuggestions(filtered);
      } else {
        setDropoffSuggestions(filtered);
      }

      setIsSearchingLocation(false);
    }, 500);
  };

  const selectLocation = (location, type) => {
    if (type === 'pickup') {
      setBookingData({...bookingData, pickupAddress: location.name});
      setPickupSuggestions([]);
    } else {
      setBookingData({...bookingData, dropoffAddress: location.name});
      setDropoffSuggestions([]);
    }

    // Calculate route if both locations are selected
    if (bookingData.pickupAddress && bookingData.dropoffAddress) {
      calculateRoute();
    }
  };

  const calculateRoute = () => {
    // Mock route calculation (replace with real API)
    const distance = Math.random() * 15 + 2; // 2-17 km
    const duration = distance * 3 + 5; // Rough estimate

    setRouteDistance({
      distance: distance.toFixed(1),
      duration: Math.round(duration),
      estimatedFare: calculateFare(distance)
    });
  };

  const calculateFare = () => {
    // Simulate fare calculation
    const distance = Math.random() * 10 + 2; // 2-12 km
    const duration = Math.random() * 30 + 10; // 10-40 minutes

    const baseFares = {
      economy: 3000,
      premium: 5000,
      suv: 7000,
      bike: 1000
    };

    const perKmRates = {
      economy: 1500,
      premium: 2500,
      suv: 3000,
      bike: 500
    };

    const baseFare = baseFares[bookingData.vehicleType];
    const distanceFare = distance * perKmRates[bookingData.vehicleType];
    const total = baseFare + distanceFare;

    setFareEstimate({
      distance: distance.toFixed(1),
      duration: Math.round(duration),
      total: Math.round(total)
    });
    toast.success(`Fare estimated at ${Math.round(total)} RWF`, { icon: '💰' });
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
      toast.error('Failed to cancel ride. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully. See you soon!', { icon: '👋' });
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
      <header className="app-header">
        <button className="menu-trigger" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      <PassengerSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage="dashboard"
      />

      {/* Floating Panel (Booking / Active Ride) */}
      <div className="floating-panel">

        {/* Booking Form */}
        {showBooking && !activeRide && (
        <div className="panel-card booking-form">
          <h2 className="mb-3 text-lg font-bold">Where to?</h2>

          <form onSubmit={handleBookRide}>
            <div className="location-input-group">
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} color="green" />
                <input
                  type="text"
                  name="pickupAddress"
                  className="panel-input"
                  placeholder="Enter pickup location..."
                  value={bookingData.pickupAddress}
                  onChange={handleInputChange}
                  required
                />
                {isSearchingLocation && 'pickupAddress' === 'pickupAddress' && (
                  <div className="search-spinner">
                    <div className="spinner-small"></div>
                  </div>
                )}
              </div>

                {/* Pickup Suggestions */}
                {pickupSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {pickupSuggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        className="suggestion-item"
                        onClick={() => selectLocation(suggestion, 'pickup')}
                      >
                        <MapPin size={14} className="suggestion-icon" />
                        <div>
                          <div className="suggestion-name">{suggestion.name}</div>
                          <div className="suggestion-address">{suggestion.address}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="location-input-group">
                <div className="input-wrapper">
                  <Navigation className="input-icon" size={18} color="red" />
                  <input
                    type="text"
                    name="dropoffAddress"
                    className="panel-input"
                    placeholder="Enter destination..."
                    value={bookingData.dropoffAddress}
                    onChange={handleInputChange}
                    required
                  />
                  {isSearchingLocation && 'dropoffAddress' === 'dropoffAddress' && (
                    <div className="search-spinner">
                      <div className="spinner-small"></div>
                    </div>
                  )}
                </div>

                {/* Dropoff Suggestions */}
                {dropoffSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {dropoffSuggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.id}
                        className="suggestion-item"
                        onClick={() => selectLocation(suggestion, 'dropoff')}
                      >
                        <Navigation size={14} className="suggestion-icon" />
                        <div>
                          <div className="suggestion-name">{suggestion.name}</div>
                          <div className="suggestion-address">{suggestion.address}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Route Visualization */}
              {routeDistance && (
                <div className="route-visualization">
                  <div className="route-info">
                    <div className="route-item">
                      <Route size={16} />
                      <span>Distance: {routeDistance.distance} km</span>
                    </div>
                    <div className="route-item">
                      <Clock size={16} />
                      <span>Duration: {routeDistance.duration} min</span>
                    </div>
                    <div className="route-item">
                      <DollarSign size={16} />
                      <span>Estimated: {routeDistance.estimatedFare} RWF</span>
                    </div>
                  </div>
                  <div className="route-line"></div>
                </div>
              )}

              <div className="vehicle-type-selector">
                {['economy', 'premium', 'suv', 'bike'].map((type) => (
                  <div
                    key={type}
                    className={`vehicle-option ${bookingData.vehicleType === type ? 'selected' : ''}`}
                    onClick={() => {
                      setBookingData({...bookingData, vehicleType: type});
                      toast(`Selected ${type.charAt(0).toUpperCase() + type.slice(1)} class`, { icon: '✨', duration: 1500 });
                    }}
                  >
                    <div className="vehicle-icon-wrapper">
                      {type === 'economy' && <Car size={24} />}
                      {type === 'premium' && <Zap size={24} />}
                      {type === 'suv' && <Shield size={24} />}
                      {type === 'bike' && <Bike size={24} />}
                    </div>
                    <span className="vehicle-name capitalize">{type}</span>
                  </div>
                ))}
              </div>

              {fareEstimate ? (
                 <div className="fare-display">
                    <div>
                        <div className="text-xs text-gray-500">Estimate</div>
                        <div className="fare-value">{fareEstimate.total} RWF</div>
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
           <div className="panel-card active-ride-premium">
              {/* Header: Status and Price */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className={`status-badge-premium ${activeRide.status}`}>
                    {activeRide.status === 'pending' && <span className="pulse-dot"></span>}
                    {activeRide.status === 'pending' ? 'Searching for drivers' : activeRide.status.toUpperCase()}
                  </div>
                  <h2 className="price-tag-premium">{activeRide.fare.total} RWF</h2>
                </div>
                <div className={`vehicle-icon-large-premium type-${activeRide.vehicleType}`}>
                   {activeRide.vehicleType === 'economy' && <Car size={40} strokeWidth={1.5} />}
                   {activeRide.vehicleType === 'premium' && <Zap size={40} strokeWidth={1.5} />}
                   {activeRide.vehicleType === 'suv' && <Shield size={40} strokeWidth={1.5} />}
                   {activeRide.vehicleType === 'bike' && <Bike size={40} strokeWidth={1.5} />}
                </div>
              </div>

              {/* Driver Section */}
              {activeRide.driver ? (
                  <div className="driver-profile-premium">
                      <div className="avatar-container">
                        <img
                          src={activeRide.driver.avatar || 'https://via.placeholder.com/60'}
                          alt="Driver"
                          className="driver-avatar-lg"
                        />
                        <div className="rating-badge">
                          <Star size={10} fill="currentColor" />
                          <span>4.9</span>
                        </div>
                      </div>
                      <div className="flex-1">
                          <div className="driver-name-row">
                            <h3>{activeRide.driver.name}</h3>
                            <div className="contact-actions">
                               <button className="action-circle-btn"><Clock size={16} /></button>
                               <button className="action-circle-btn"><Star size={16} /></button>
                            </div>
                          </div>
                          <div className="vehicle-info-text text-gray-500">
                             {activeRide.driver.driverDetails?.vehicleColor} {activeRide.driver.driverDetails?.vehicleModel}
                             <span className="plate-pill">{activeRide.driver.driverDetails?.vehiclePlate}</span>
                          </div>
                      </div>
                  </div>
              ) : activeRide.status === 'pending' ? (
                <div className="nearby-preview-container">
                  <div className="connecting-info">
                    <div className="loading-line"></div>
                    <p>Drivers nearby are seeing your request...</p>
                  </div>

                  {nearbyDriver && (
                    <div className="nearby-driver-pill animate-in fade-in slide-in-from-right">
                       <img src={nearbyDriver.avatar} alt="" className="nearby-avatar" />
                       <div className="flex-1">
                          <div className="flex justify-between text-xs">
                             <span className="font-bold">{nearbyDriver.name} is nearby</span>
                             <span>{nearbyDriver.rating} ★</span>
                          </div>
                          <div className="text-[10px] text-gray-400">{nearbyDriver.vehicle} • {nearbyDriver.plate}</div>
                       </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="destination-row-premium">
                 <div className="location-indicator">
                    <div className="dot start"></div>
                    <div className="line"></div>
                    <div className="dot end"></div>
                 </div>
                 <div className="flex-1">
                    <div className="location-item">
                       <span className="label">PICKUP</span>
                       <span className="value truncate">{activeRide.pickupLocation.address}</span>
                    </div>
                    <div className="location-item mt-4">
                       <span className="label">DESTINATION</span>
                       <span className="value truncate">{activeRide.dropoffLocation.address}</span>
                    </div>
                 </div>
              </div>

              {activeRide.status !== 'completed' && activeRide.status !== 'cancelled' && (
                  <button
                    className="cancel-btn-subtle"
                    onClick={handleCancelRide}
                  >
                      Cancel Trip
                  </button>
              )}
           </div>
        )}

        {/* Ride History (Only shown if sidebar open? No, keep it in sidebar) */}
      </div>

    </div>
  );
};

export default PassengerDashboard;
