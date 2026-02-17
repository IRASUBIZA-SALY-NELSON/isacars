import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg:       "#f4f6f8",      // page background — light gray
  panel:    "#ffffff",      // cards / sidebar — white
  card:     "#f8fafc",      // inner card bg
  border:   "#e2e8f0",      // subtle borders
  green:    "#22c55e",      // brand green (buttons, accents)
  greenDk:  "#16a34a",      // darker green
  greenLt:  "#dcfce7",      // light green tint (badge bg)
  sidebar:  "#111827",      // sidebar stays dark
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

const DriverSidebar = ({ isOpen, onClose, currentPage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isOpen ? 'rgba(0,0,0,0.4)' : 'transparent',
      zIndex: isOpen ? 50 : -1,
      transition: 'all 0.3s ease',
      display: isOpen ? 'block' : 'none'
    }} onClick={onClose}>
      <div style={{
        width: collapsed ? 62 : 300,
        height: '100%',
        background: C.sidebar,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,0.1)",flexShrink:0}}>
          <div style={{width:38,height:38,borderRadius:10,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 16px ${C.green}60`}}>
            <Icon name="car" size={19} color="#fff"/>
          </div>
          {!collapsed && (
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
                <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:2}}>4.9</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>Rating</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:2}}>154</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}}>Trips</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:2}}>$1250.5</div>
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
            const active = currentPage === n.id;
            return (
              <button key={n.id} onClick={() => {
                if (n.id === 'dashboard') navigate('/driver/dashboard');
                else if (n.id === 'earnings') navigate('/driver/earnings');
                else if (n.id === 'history') navigate('/driver/history');
                else if (n.id === 'vehicle') navigate('/driver/vehicle');
                else if (n.id === 'profile') navigate('/driver/profile');
                else if (n.id === 'settings') navigate('/driver/settings');
                onClose();
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
                {!collapsed && <span style={{fontSize:13,fontWeight:active?700:500,flex:1}}>{n.label}</span>}
                {!collapsed && active && <span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>}
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
            {!collapsed && <span style={{fontSize:13,fontWeight:600}}>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverSidebar;
