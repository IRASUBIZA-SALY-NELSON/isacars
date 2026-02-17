import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Shield, Edit2 } from 'lucide-react';

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
    arrowLeft: <svg {...w} viewBox="0 0 24 24" {...p}><polyline points="19 12 5 12 12 19"/><polyline points="5 12 19 12 12 5"/></svg>,
    user:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    mail:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone:     <svg {...w} viewBox="0 0 24 24" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 0-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    shield:    <svg {...w} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    edit:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  };
  return icons[name] || <span style={{ width: size, height: size, display: "inline-block" }} />;
};

const DriverProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      {/* Header */}
      <header style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"0 16px",height:60,display:"flex",alignItems:"center",gap:16,flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <button onClick={() => navigate('/driver/dashboard')}
          style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"border-color 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
          onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
          <Icon name="arrowLeft" size={16} color={C.muted}/>
        </button>

        <div style={{minWidth:0}}>
          <div style={{fontSize:15,fontWeight:800,color:C.text,whiteSpace:"nowrap"}}>My Profile</div>
          <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
        </div>

        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDk},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",boxShadow:`0 0 10px ${C.green}40`,flexShrink:0}}>{user?.name?.charAt(0).toUpperCase() || 'D'}</div>
        </div>
      </header>

      {/* Content */}
      <main style={{flex:1,overflowY:"auto",padding:"20px",maxWidth:"600px",width:"100%",margin:"0 auto"}}>
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",marginBottom:20,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{
                  width:80,height:80,
                  borderRadius:"50%",
                  background:C.card,
                  marginBottom:16,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:32,fontWeight:700,color:C.muted
              }}>
                  {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 style={{margin:0,color:C.text,fontSize:24,fontWeight:700}}>{user?.name}</h2>
              <div style={{color:C.muted,fontSize:14}}>Driver Account</div>
              <div style={{
                  background:C.greenLt,color:C.greenDk,
                  display:"inline-block",padding:"4px 12px",
                  borderRadius:16,fontSize:12,fontWeight:600,marginTop:8
              }}>
                  Verified Driver
              </div>
          </div>

          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",marginBottom:24,width:"100%",boxSizing:"border-box"}}>
              <ProfileItem icon="mail" label="Email" value={user?.email} />
              <ProfileItem icon="phone" label="Phone" value={user?.phone || '+1 234 567 890'} />
              <ProfileItem icon="shield" label="License ID" value={user?.driverDetails?.licenseNumber || 'Hidden'} />
          </div>

          <button style={{
              width:"100%",
              background:C.green,
              color:"#fff",
              border:"none",
              padding:14,
              borderRadius:12,
              fontSize:14,fontWeight:600,
              cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              boxShadow:`0 4px 12px ${C.green}40`,
              transition:"background 0.2s"
          }}
          onMouseEnter={e=>e.currentTarget.style.background=C.greenDk}
          onMouseLeave={e=>e.currentTarget.style.background=C.green}
          >
            <Icon name="edit" size={16} color="#fff"/>
            Edit Profile
          </button>
      </main>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => {
  // ─── COLORS ───────────────────────────────────────────────────────────
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

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name={icon} size={18} color={C.muted} />
            <span style={{ color: C.muted }}>{label}</span>
        </div>
        <span style={{ color: C.text, fontWeight: 500 }}>{value}</span>
    </div>
  );
};

export default DriverProfile;
