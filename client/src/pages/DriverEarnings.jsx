import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Download, Car, Menu } from 'lucide-react';
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
    trending:  <svg {...w} viewBox="0 0 24 24" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    dollar:    <svg {...w} viewBox="0 0 24 24" {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    calendar:  <svg {...w} viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    download:  <svg {...w} viewBox="0 0 24 24" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    car:       <svg {...w} viewBox="0 0 24 24" {...p}><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
  };
  return icons[name] || <span style={{ width: size, height: size, display: "inline-block" }} />;
};

const DriverEarnings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock Earnings Data
  const weeklyEarnings = [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 145 },
    { day: 'Wed', amount: 90 },
    { day: 'Thu', amount: 200 },
    { day: 'Fri', amount: 250 },
    { day: 'Sat', amount: 310 },
    { day: 'Sun', amount: 180 },
  ];

  const totalWeekly = weeklyEarnings.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <DriverSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} currentPage="earnings" />

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Content */}
      <main style={{flex:1,overflowY:"auto",padding:24}}>
          {/* Summary Card */}
          <div style={{
              background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenDk} 100%)`,
              padding: 24,
              borderRadius: 16,
              color: '#fff',
              marginBottom: 24,
              boxShadow: `0 10px 20px ${C.green}40`
          }}>
              <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>TOTAL BALANCE</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 24 }}>${user?.driverDetails?.earnings || '1,250.50'}</div>

              <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: 'none',
                      background: 'white',
                      color: C.green,
                      fontWeight: 700
                   }}>
                      Cash Out
                  </button>
                  <button style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid rgba(255,255,255,0.3)`,
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                   }}>
                      <Icon name="download" size={18} color="#fff"/>
                      Export
                  </button>
              </div>
          </div>

          {/* Weekly Chart */}
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,alignItems:"center"}}>
                  <h3 style={{margin:0,color:C.text,fontSize:16,fontWeight:700}}>Weekly Report</h3>
                  <span style={{fontSize:14,color:C.green,fontWeight:600}}>${totalWeekly}</span>
              </div>

              <div style={{display:"flex",alignItems:"flex-end",height:150,gap:12}}>
                  {weeklyEarnings.map((day) => (
                      <div key={day.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                          <div style={{
                              width:"100%",
                              background:day.amount > 200?C.green:C.greenLt,
                              borderRadius:8,
                              height:`${(day.amount / 350) * 100}%`,
                              minHeight:10
                          }}></div>
                          <span style={{fontSize:12,color:C.muted}}>{day.day}</span>
                      </div>
                  ))}
              </div>
          </div>

          {/* Recent Activity */}
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <h3 style={{margin:"0 0 16px",color:C.text,fontSize:16,fontWeight:700}}>Recent Activity</h3>
              {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                      display:"flex",
                      justifyContent:"space-between",
                      padding:"16px 0",
                      borderBottom:`1px solid ${C.border}`
                  }}>
                      <div style={{display:"flex",gap:12}}>
                          <div style={{
                              width:40,height:40,
                              borderRadius:"50%",
                              background:C.card,
                              display:"flex",alignItems:"center",justifyContent:"center"
                          }}>
                              <Icon name="car" size={18} color={C.muted}/>
                          </div>
                          <div>
                              <div style={{fontWeight:600,color:C.text}}>Trip to Airport</div>
                              <div style={{fontSize:12,color:C.muted}}>Today, 10:30 AM</div>
                              <div style={{fontSize:12,color:C.muted}}>Online Payment</div>
                          </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                          <div style={{fontWeight:700,color:C.green,fontSize:14}}>$24.50</div>
                          <div style={{fontSize:12,color:C.muted}}>Completed</div>
                      </div>
                  </div>
              ))}
          </div>
      </main>
      </div>
    </div>
  );
};


export default DriverEarnings;
