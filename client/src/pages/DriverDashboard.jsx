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
  Bell,
  DollarSign,
  Star,
  Activity
} from 'lucide-react';
import api from '../utils/api';
import socketService from '../services/socket';
import MapComponent from '../components/MapComponent';
import toast from 'react-hot-toast';
import './DriverDashboard.css';

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg:       "#f4f6f8",      // page background — light gray
  panel:    "#ffffff",      // cards / sidebar — white
  card:     "#f8fafc",      // inner card bg
  border:   "#e2e8f0",      // subtle borders
  green:    "#22c55e",      // brand green (buttons, accents)
  greenDk:  "#16a34a",      // darker green
  greenLt:  "#dcfce7",      // light green tint (badge bg)
  sidebar:  "#111827",      // sidebar stays dark (like your screenshot)
  sideText: "#ffffff",
  sideMut:  "#9ca3af",
  text:     "#111827",      // primary text
  textSoft: "#475569",      // secondary text
  muted:    "#94a3b8",      // muted text
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const p = { fill: "none", stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  const w = { width: size, height: size, display: "inline-block", verticalAlign: "middle", flexShrink: 0 };
  const icons = {
    grid:      <svg {...w} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    map:       <svg {...w} viewBox="0 0 24 24" {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    car:       <svg {...w} viewBox="0 0 24 24" {...p}><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
    user:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    trending:  <svg {...w} viewBox="0 0 24 24" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    dollar:    <svg {...w} viewBox="0 0 24 24" {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    star:      <svg {...w} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    activity:  <svg {...w} viewBox="0 0 24 24" {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    history:   <svg {...w} viewBox="0 0 24 24" {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
    settings:  <svg {...w} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    menu:      <svg {...w} viewBox="0 0 24 24" {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    logout:    <svg {...w} viewBox="0 0 24 24" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    pin:       <svg {...w} viewBox="0 0 24 24" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    clock:     <svg {...w} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    check:     <svg {...w} viewBox="0 0 24 24" {...p} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    bell:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    arrowRight:<svg {...w} viewBox="0 0 24 24" {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    shield:    <svg {...w} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  };
  return icons[name] || <span style={{ width: size, height: size, display: "inline-block" }} />;
};

const DriverDashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(user?.driverDetails?.isAvailable || false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open for desktop
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const SidebarContent = () => (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,0.1)",flexShrink:0}}>
        <div style={{width:38,height:38,borderRadius:10,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 16px ${C.green}60`}}>
          <Icon name="car" size={19} color="#fff"/>
        </div>
        {!collapsed&&(
          <div>
            <div style={{fontSize:15,fontWeight:900,color:"#fff",letterSpacing:-0.5,lineHeight:1}}>ISACARS</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:3,fontWeight:700,letterSpacing:1}}>DRIVER PANEL</div>
          </div>
        )}
      </div>

      {/* Driver Profile Section */}
      {!collapsed && (
        <div style={{
          margin:"0 8px 8px",padding:"14px 16px",background:"rgba(255,255,255,0.06)",
          borderRadius:12,border:"1px solid rgba(255,255,255,0.09)",flexShrink:0
        }}>
          <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.35)",letterSpacing:1.5,marginBottom:10}}>DRIVER PROFILE</div>

          {/* User Info */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{
              width:44,height:44,borderRadius:"50%",
              background:`linear-gradient(135deg,${C.greenDk},${C.green})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"#fff",fontWeight:900,fontSize:14,flexShrink:0
            }}>{user?.name?.charAt(0).toUpperCase() || 'D'}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{user?.name || 'Driver Name'}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>Driver Account</div>
            </div>
            <button
              onClick={toggleAvailability}
              style={{
                background:isAvailable?"rgba(34,197,94,0.2)":"rgba(0,0,0,0.2)",
                padding:"6px 12px",borderRadius:20,
                display:"flex",alignItems:"center",gap:6,
                fontSize:11,fontWeight:600,cursor:"pointer",
                border:"none",color:"#fff",transition:"background 0.2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.background=isAvailable?"rgba(34,197,94,0.3)":"rgba(0,0,0,0.3)"}
              onMouseLeave={e=>e.currentTarget.style.background=isAvailable?"rgba(34,197,94,0.2)":"rgba(0,0,0,0.2)"}
            >
              <div style={{
                width:6,height:6,borderRadius:"50%",
                background:isAvailable?C.green:"#bdc3c7",
                boxShadow:isAvailable?`0 0 5px ${C.green}`:"none"
              }}/>
              {isAvailable ? 'Online' : 'Offline'}
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display:"flex",justifyContent:"space-between",
            borderTop:"1px solid rgba(255,255,255,0.2)",
            paddingTop:12
          }}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:2}}>{earnings?.rating || '4.9'}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>Rating</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:2}}>{earnings?.totalRides || '154'}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>Trips</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:2}}>${earnings?.total || '1250.5'}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>Earned</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
        {[
          {id:"dashboard", icon:"grid", label:"Dashboard"},
          {id:"earnings", icon:"trending", label:"Earnings"},
          {id:"history", icon:"history", label:"Trip History"},
          {id:"vehicle", icon:"car", label:"Vehicle Info"},
          {id:"profile", icon:"user", label:"Profile"},
          {id:"settings", icon:"settings", label:"Settings"},
        ].map(n=>{
          const active = false; // You can add active state logic here
          return (
            <button key={n.id} onClick={() => {
              if (n.id === 'earnings') navigate('/driver/earnings');
              else if (n.id === 'history') navigate('/driver/history');
              else if (n.id === 'vehicle') navigate('/driver/vehicle');
              else if (n.id === 'profile') navigate('/driver/profile');
            }}
              style={{
                display:"flex",alignItems:"center",gap:12,
                padding:collapsed?"11px 11px":"11px 14px",
                borderRadius:10,border:"none",cursor:"pointer",width:"100%",textAlign:"left",
                background:active?`${C.green}25`:"transparent",
                borderLeft:active?`3px solid ${C.green}`:"3px solid transparent",
                color:active?C.green:"rgba(255,255,255,0.55)",transition:"all 0.2s"
              }}
              onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(255,255,255,0.85)";}}}
              onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}}
            >
              <Icon name={n.icon} size={17} color={active?C.green:"currentColor"}/>
              {!collapsed&&<span style={{fontSize:13,fontWeight:active?700:500,flex:1}}>{n.label}</span>}
              {!collapsed&&active&&<span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{padding:"12px 8px",borderTop:"1px solid rgba(255,255,255,0.08)",flexShrink:0}}>
        <button onClick={handleLogout} style={{
          display:"flex",alignItems:"center",gap:10,
          padding:"10px 14px",borderRadius:10,border:"none",
          background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer",width:"100%",transition:"all 0.2s"
        }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.15)";e.currentTarget.style.color="#ef4444";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.4)";}}>
          <Icon name="logout" size={16} color="currentColor"/>
          {!collapsed&&<span style={{fontSize:13,fontWeight:600}}>Logout</span>}
        </button>
      </div>
    </div>
  );

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
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      {/* Sidebar — dark */}
      <div style={{width:collapsed?62:300,flexShrink:0,background:C.sidebar,transition:"width 0.3s ease",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <SidebarContent/>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        {/* Header */}
        <header style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:60,display:"flex",alignItems:"center",gap:16,flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
          <button onClick={()=>setCollapsed(c=>!c)}
            style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"border-color 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <Icon name="menu" size={16} color={C.muted}/>
          </button>

          <div style={{minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,color:C.text,whiteSpace:"nowrap"}}>Driver Dashboard</div>
            <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>

          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px"}}>
              <Icon name="search" size={14} color={C.muted}/>
              <input placeholder="Search..." style={{background:"transparent",border:"none",outline:"none",fontSize:12,color:C.text,width:130}}/>
            </div>
            <div style={{position:"relative"}}>
              <button style={{width:36,height:36,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <Icon name="bell" size={16} color={C.muted}/>
              </button>
              {pendingRequests.length > 0 && (
                <span style={{position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:"#ef4444",fontSize:9,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{pendingRequests.length}</span>
              )}
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDk},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",boxShadow:`0 0 10px ${C.green}40`,flexShrink:0}}>{user?.name?.charAt(0).toUpperCase() || 'D'}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,position:"relative",overflow:"hidden"}}>
          <div style={{width:"100%",height:"100%"}}>
            <MapComponent
               pickup={activeRide?.pickupLocation}
               dropoff={activeRide?.dropoffLocation}
               driver={activeRide?.driver?.driverDetails?.currentLocation}
            />
          </div>

          {/* Floating Action Panels */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:24,pointerEvents:"none",display:"flex",justifyContent:"center"}}>
            {/* Pending Request Card */}
            {pendingRequests.length > 0 && !activeRide && (
               <div style={{
                 pointerEvents:"auto",
                 background:C.panel,
                 borderRadius:16,
                 padding:24,
                 boxShadow:"0 10px 40px rgba(0,0,0,0.15)",
                 width:"100%",
                 maxWidth:400,
                 marginBottom:24,
                 border:`1px solid ${C.border}`
               }}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,fontWeight:600,color:C.text}}>
                     <Icon name="bell" size={20} color={C.green}/>
                     <span>New Opportunity</span>
                     <span style={{marginLeft:"auto",fontSize:18,fontWeight:700,color:C.green}}>${pendingRequests[0].fare.total}</span>
                  </div>
                  <div style={{marginBottom:24}}>
                     <div style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:C.textSoft,marginBottom:12}}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:C.green}}/>
                        <p>{pendingRequests[0].pickupLocation.address}</p>
                     </div>
                     <div style={{width:2,height:20,background:C.border,marginLeft:4,margin:"4px 0"}}></div>
                     <div style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:C.textSoft}}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:"#ef4444"}}/>
                        <p>{pendingRequests[0].dropoffLocation.address}</p>
                     </div>
                  </div>
                  <button
                    onClick={() => acceptRide(pendingRequests[0]._id)}
                    style={{
                      width:"100%",
                      background:C.green,
                      color:"#fff",
                      border:"none",
                      padding:16,
                      borderRadius:12,
                      fontWeight:700,
                      fontSize:16,
                      cursor:"pointer",
                      boxShadow:`0 4px 15px ${C.green}40`,
                      transition:"transform 0.2s"
                    }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                  >
                     Accept Ride
                  </button>
               </div>
            )}

            {/* Active Ride Card */}
            {activeRide && (
               <div style={{
                 pointerEvents:"auto",
                 background:C.panel,
                 borderRadius:16,
                 padding:24,
                 boxShadow:"0 10px 40px rgba(0,0,0,0.15)",
                 width:"100%",
                 maxWidth:400,
                 marginBottom:24,
                 borderTop:`5px solid ${C.green}`,
                 border:`1px solid ${C.border}`
               }}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                    <div style={{
                      background:C.greenLt,
                      color:C.greenDk,
                      padding:"4px 12px",
                      borderRadius:12,
                      fontSize:12,
                      fontWeight:700,
                      textTransform:"uppercase"
                    }}>{activeRide.status.replace('_', ' ')}</div>
                    <div style={{fontSize:18,fontWeight:700,color:C.text}}>${activeRide.fare.total}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
                     <div style={{
                       width:40,height:40,borderRadius:"50%",
                       background:C.card,
                       display:"flex",alignItems:"center",justifyContent:"center",
                       fontWeight:700,color:C.textSoft
                     }}>{activeRide.passenger?.name[0]}</div>
                     <div style={{flex:1}}>
                        <h4 style={{margin:0,fontSize:16,color:C.text}}>{activeRide.passenger?.name}</h4>
                        <span style={{fontSize:12,color:C.muted}}>Passenger</span>
                     </div>
                     <div style={{display:"flex",gap:8}}>
                        <button style={{
                          width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,
                          background:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"
                        }}>
                          <Icon name="shield" size={18} color={C.muted}/>
                        </button>
                     </div>
                  </div>
                  <div style={{display:"flex",gap:12}}>
                      {activeRide.status === 'accepted' && (
                          <button
                            onClick={() => updateRideStatus('arrived')}
                            style={{
                              flex:1,
                              background:C.green,
                              color:"#fff",
                              border:"none",
                              padding:14,
                              borderRadius:12,
                              fontWeight:600,
                              cursor:"pointer",
                              transition:"background 0.2s"
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background=C.greenDk}
                            onMouseLeave={e=>e.currentTarget.style.background=C.green}
                          >
                             Confirm Arrival
                          </button>
                      )}
                      {activeRide.status === 'arrived' && (
                          <button
                            onClick={() => updateRideStatus('started')}
                            style={{
                              flex:1,
                              background:C.green,
                              color:"#fff",
                              border:"none",
                              padding:14,
                              borderRadius:12,
                              fontWeight:600,
                              cursor:"pointer",
                              transition:"background 0.2s"
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background=C.greenDk}
                            onMouseLeave={e=>e.currentTarget.style.background=C.green}
                          >
                             Start Trip
                          </button>
                      )}
                      {activeRide.status === 'started' && (
                          <button
                            onClick={() => updateRideStatus('completed')}
                            style={{
                              flex:1,
                              background:C.green,
                              color:"#fff",
                              border:"none",
                              padding:14,
                              borderRadius:12,
                              fontWeight:600,
                              cursor:"pointer",
                              transition:"background 0.2s"
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background=C.greenDk}
                            onMouseLeave={e=>e.currentTarget.style.background=C.green}
                          >
                             Complete Trip
                          </button>
                      )}
                  </div>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
