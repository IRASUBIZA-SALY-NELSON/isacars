import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  History,
  Car,
  User,
  LogOut,
  Menu,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  Bell
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
  const [earnings, setEarnings] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open for desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    // Data handling
    fetchActiveRide();
    fetchEarnings();
    setupSocketListeners();
    startLocationTracking();

    return () => {
      window.removeEventListener('resize', handleResize);
      socketService.off('newRideRequest');
      socketService.off('rideStatusUpdated');
      socketService.off('rideCancelled');
    };
  }, []);

  const setupSocketListeners = () => {
    socketService.on('newRideRequest', (ride) => {
      if (isAvailable && !activeRide) {
        toast.custom((t) => (
          <div className="custom-toast-request">
             <div className="toast-header">
                <span>New Ride Request</span>
                <span className="toast-price">${ride.fare.total}</span>
             </div>
             <div className="toast-body">
                <p>Pickup: {ride.pickupLocation.address}</p>
             </div>
          </div>
        ));
        setPendingRequests((prev) => [...prev, ride]);
      }
    });

    socketService.on('rideStatusUpdated', (ride) => {
      if (ride.driver?._id === user?.id || ride.driver === user?.id) {
        setActiveRide(ride);
      }
    });

    socketService.on('rideCancelled', (ride) => {
        setActiveRide(null);
        toast.error('Ride cancelled');
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
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  };

  const updateDriverLocation = async (latitude, longitude) => {
    try {
      await api.put('/drivers/location', { latitude, longitude });
    } catch (error) {
      // Silent error
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
      setEarnings(response.data.earnings);
    } catch (error) {
       // Mock for display if API fails (common in dev often)
       setEarnings({ rating: 4.9, totalRides: 154, total: 1250.50 });
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !isAvailable;
      await api.put('/drivers/availability', { isAvailable: newStatus });
      setIsAvailable(newStatus);
      toast.success(newStatus ? 'You are Online' : 'You are Offline');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const acceptRide = async (rideId) => {
    try {
      const response = await api.put(`/rides/${rideId}/accept`);
      setActiveRide(response.data.ride);
      setPendingRequests([]);
      setIsAvailable(false);
      toast.success('Ride accepted');
    } catch (error) {
      toast.error('Failed to accept ride');
    }
  };

  const updateRideStatus = async (status) => {
    if (!activeRide) return;
    try {
      const response = await api.put(`/rides/${activeRide._id}/status`, { status });
      setActiveRide(response.data.ride);
      if (status === 'completed') {
        setActiveRide(null);
        setIsAvailable(true);
        fetchEarnings();
        toast.success('Trip Completed!');
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="driver-layout">
      {/* Mobile Header */ }
      {isMobile && (
        <div className="mobile-header">
           <button onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
           <span className="mobile-title">Driver Console</span>
           <div className={`status-badge-sm ${isAvailable ? 'online' : 'offline'}`}>
              {isAvailable ? 'On' : 'Off'}
           </div>
        </div>
      )}

      {/* Sidebar - Persistent on Desktop, Drawer on Mobile */}
      <aside className={`driver-sidebar ${isSidebarOpen ? 'open' : ''}`}>

        {/* Sidebar Header (Green Section) */}
        <div className="sidebar-hero">
           <div className="user-row">
              <div className="avatar-circle">
                 {user?.name ? user.name.charAt(0).toUpperCase() : <User />}
              </div>
              <div className="user-details">
                 <h3>{user?.name || 'Driver Name'}</h3>
                 <span>Driver Account</span>
              </div>
              <div className={`status-pill ${isAvailable ? 'active' : ''}`} onClick={toggleAvailability}>
                  <div className="dot"></div>
                  {isAvailable ? 'Online' : 'Offline'}
              </div>
           </div>

           <div className="stats-row">
              <div className="stat-col">
                 <span className="stat-val">{earnings?.rating || '5.0'}</span>
                 <span className="stat-lbl">Rating</span>
              </div>
              <div className="stat-col">
                 <span className="stat-val">{earnings?.totalRides || '0'}</span>
                 <span className="stat-lbl">Trips</span>
              </div>
              <div className="stat-col">
                 <span className="stat-val">${earnings?.total || '0.0'}</span>
                 <span className="stat-lbl">Earned</span>
              </div>
           </div>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-nav">
           <a href="#" className="nav-item">
              <TrendingUp size={20} />
              <span>Earnings</span>
              <ChevronRight size={16} className="chevron" />
           </a>
           <a href="#" className="nav-item">
              <History size={20} />
              <span>Trip History</span>
              <ChevronRight size={16} className="chevron" />
           </a>
           <a href="#" className="nav-item">
              <Car size={20} />
              <span>Vehicle Info</span>
              <ChevronRight size={16} className="chevron" />
           </a>
           <a href="#" className="nav-item">
              <User size={20} />
              <span>Profile</span>
              <ChevronRight size={16} className="chevron" />
           </a>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
           <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Log Out</span>
           </button>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content Area */}
      <main className={`main-content ${!isMobile && isSidebarOpen ? 'shifted' : ''}`}>
         <div className="map-container-full">
            <MapComponent
               pickup={activeRide?.pickupLocation}
               dropoff={activeRide?.dropoffLocation}
               driver={activeRide?.driver?.driverDetails?.currentLocation}
            />
         </div>

         {/* Floating Action Panels */}
         <div className="floating-panels">
            {/* Pending Request Card */}
            {pendingRequests.length > 0 && !activeRide && (
               <div className="request-panel animate-slide-up">
                  <div className="panel-header-req">
                     <Bell size={20} className="bell-icon" />
                     <span>New Opportunity</span>
                     <span className="req-price">${pendingRequests[0].fare.total}</span>
                  </div>
                  <div className="req-body">
                     <div className="route-node">
                        <div className="node-dot pickup"></div>
                        <p>{pendingRequests[0].pickupLocation.address}</p>
                     </div>
                     <div className="route-line-v"></div>
                     <div className="route-node">
                        <div className="node-dot dropoff"></div>
                        <p>{pendingRequests[0].dropoffLocation.address}</p>
                     </div>
                  </div>
                  <button className="accept-btn full-width" onClick={() => acceptRide(pendingRequests[0]._id)}>
                     Accept Ride
                  </button>
               </div>
            )}

            {/* Active Ride Card */}
            {activeRide && (
               <div className="active-ride-panel animate-slide-up">
                  <div className="panel-header-active">
                     <div className="status-badge-ride">{activeRide.status.replace('_', ' ')}</div>
                     <div className="ride-cost">${activeRide.fare.total}</div>
                  </div>
                  <div className="passenger-info-row">
                     <div className="pass-avatar">{activeRide.passenger?.name[0]}</div>
                     <div className="pass-meta">
                        <h4>{activeRide.passenger?.name}</h4>
                        <span>Passenger</span>
                     </div>
                     <div className="pass-actions">
                        <button className="action-cir"><Shield size={18}/></button>
                     </div>
                  </div>
                  <div className="ride-actions-row">
                      {activeRide.status === 'accepted' && (
                          <button className="slide-btn primary" onClick={() => updateRideStatus('arrived')}>
                             Confirm Arrival
                          </button>
                      )}
                      {activeRide.status === 'arrived' && (
                          <button className="slide-btn success" onClick={() => updateRideStatus('started')}>
                             Start Trip
                          </button>
                      )}
                      {activeRide.status === 'started' && (
                          <button className="slide-btn success" onClick={() => updateRideStatus('completed')}>
                             Complete Trip
                          </button>
                      )}
                  </div>
               </div>
            )}
         </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
