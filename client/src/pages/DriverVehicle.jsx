import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, PenTool, CheckCircle, Menu } from 'lucide-react';
import DriverSidebar from '../components/DriverSidebar';

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
    car:       <svg {...w} viewBox="0 0 24 24" {...p}><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
    edit:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    check:      <svg {...w} viewBox="0 0 24 24" {...p} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  };
  return icons[name] || <span style={{ width: size, height: size, display: "inline-block" }} />;
};

const DriverVehicle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <DriverSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPage="vehicle" />

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Header */}
        <header style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:60,display:"flex",alignItems:"center",gap:16,flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
          <button onClick={() => navigate('/driver/dashboard')}
            style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"border-color 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <Icon name="arrowLeft" size={16} color={C.muted}/>
          </button>

          <button onClick={() => setIsSidebarOpen(true)}
            style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"border-color 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <Icon name="menu" size={16} color={C.muted}/>
          </button>

          <div style={{minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,color:C.text,whiteSpace:"nowrap"}}>Vehicle Info</div>
            <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>

          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDk},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",boxShadow:`0 0 10px ${C.green}40`,flexShrink:0}}>{user?.name?.charAt(0).toUpperCase() || 'D'}</div>
          </div>
        </header>

      {/* Content */}
      <main style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{
              borderRadius:16,
              background:C.card,
              padding:32,
              display:"flex",flexDirection:"column",alignItems:"center",
              marginBottom:32,
              border:`1px solid ${C.border}`,
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)"
          }}>
              <Icon name="car" size={64} color={C.muted} style={{marginBottom:16}}/>
              <div style={{fontSize:24,fontWeight:700,color:C.text}}>{user?.driverDetails?.vehicleModel || 'Tesla Model 3'}</div>
              <div style={{color:C.muted,fontSize:16}}>{user?.driverDetails?.vehiclePlate || 'ABC-1234'}</div>
              <div style={{marginTop:12,padding:"4px 12px",background:C.sidebar,color:"#fff",borderRadius:16,fontSize:12,fontWeight:600}}>
                 PREMIUM
              </div>
          </div>

          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:16}}>Details</div>
              <VehicleItem label="Color" value={user?.driverDetails?.vehicleColor || 'Black'} />
              <VehicleItem label="Year" value={user?.driverDetails?.vehicleYear || '2023'} />
              <VehicleItem label="Registration" value="Valid until Dec 2026" status="active" />
              <VehicleItem label="Insurance" value="Valid until Dec 2026" status="active" />
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
            Update Vehicle Info
          </button>
      </main>
    </div>
    </div>
  );
};

const VehicleItem = ({ label, value, status }) => {
  // Use same color constants as other components
  const C = {
    bg: "#f4f6f8",
    panel: "#ffffff",
    card: "#f8fafc",
    border: "#e2e8f0",
    green: "#22c55e",
    greenDk: "#16a34a",
    greenLt: "#dcfce7",
    sidebar: "#111827",
    sideText: "#ffffff",
    sideMut: "#9ca3af",
    text: "#111827",
    textSoft: "#475569",
    muted: "#94a3b8",
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="car" size={18} color={C.muted} />
            <span style={{ color: C.muted }}>{label}</span>
        </div>
        <span style={{ color: C.text, fontWeight: 500 }}>{value}</span>
        {status === 'active' && <Icon name="check" size={16} color={C.green} />}
    </div>
  );
};
export default DriverVehicle;
