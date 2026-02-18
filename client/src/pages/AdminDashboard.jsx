import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "../utils/toast";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";

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
  const w = { width: size, height: size, display: "inline-block", verticalalign: "middle", flexshrink: 0 };
  const icons = {
    grid:      <svg {...w} viewBox="0 0 24 24" {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    map:       <svg {...w} viewBox="0 0 24 24" {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    car:       <svg {...w} viewBox="0 0 24 24" {...p}><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
    user:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    users:     <svg {...w} viewBox="0 0 24 24" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    trending:  <svg {...w} viewBox="0 0 24 24" {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    dollar:    <svg {...w} viewBox="0 0 24 24" {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    settings:  <svg {...w} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    bell:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    search:    <svg {...w} viewBox="0 0 24 24" {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    menu:      <svg {...w} viewBox="0 0 24 24" {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    logout:    <svg {...w} viewBox="0 0 24 24" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    pin:       <svg {...w} viewBox="0 0 24 24" {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    activity:  <svg {...w} viewBox="0 0 24 24" {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    star:      <svg {...w} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    arrowUp:   <svg {...w} viewBox="0 0 24 24" {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrowDown: <svg {...w} viewBox="0 0 24 24" {...p}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    tool:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    check:     <svg {...w} viewBox="0 0 24 24" {...p} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    clock:     <svg {...w} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    plus:      <svg {...w} viewBox="0 0 24 24" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    barChart:  <svg {...w} viewBox="0 0 24 24" {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    edit:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    eye:       <svg {...w} viewBox="0 0 24 24" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    save:      <svg {...w} viewBox="0 0 24 24" {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    xIcon:     <svg {...w} viewBox="0 0 24 24" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  };
  return icons[name] || <span style={{ width: size, height: size, display: "inline-block" }} />;
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const revenueData = [
  { month:"Jan", revenue:12400, rides:340, expenses:4200 },
  { month:"Feb", revenue:15800, rides:420, expenses:5100 },
  { month:"Mar", revenue:13200, rides:380, expenses:4800 },
  { month:"Apr", revenue:18900, rides:510, expenses:6200 },
  { month:"May", revenue:22100, rides:630, expenses:7300 },
  { month:"Jun", revenue:19500, rides:570, expenses:6800 },
  { month:"Jul", revenue:25300, rides:720, expenses:8100 },
  { month:"Aug", revenue:28700, rides:810, expenses:9400 },
  { month:"Sep", revenue:24100, rides:680, expenses:7900 },
  { month:"Oct", revenue:21800, rides:610, expenses:7100 },
  { month:"Nov", revenue:17600, rides:490, expenses:5800 },
  { month:"Dec", revenue:30200, rides:870, expenses:9800 },
];
const locationData = [
  { city:"New York",    rides:3200, revenue:89000, drivers:45 },
  { city:"Los Angeles", rides:2800, revenue:74000, drivers:38 },
  { city:"Chicago",     rides:1900, revenue:52000, drivers:26 },
  { city:"Houston",     rides:1400, revenue:38000, drivers:19 },
  { city:"Miami",       rides:2100, revenue:61000, drivers:28 },
  { city:"Seattle",     rides:1600, revenue:44000, drivers:21 },
];
const peakHoursData = [
  {hour:"00",rides:45},{hour:"02",rides:22},{hour:"04",rides:25},
  {hour:"06",rides:145},{hour:"08",rides:410},{hour:"10",rides:240},
  {hour:"12",rides:350},{hour:"14",rides:260},{hour:"16",rides:380},
  {hour:"18",rides:520},{hour:"20",rides:340},{hour:"22",rides:180},
];
const vehicleTypeData = [
  { name:"Sedan",    value:38, color:"#22c55e" },
  { name:"SUV",      value:28, color:"#16a34a" },
  { name:"Luxury",   value:18, color:"#4ade80" },
  { name:"Electric", value:10, color:"#86efac" },
  { name:"Van",      value:6,  color:"#bbf7d0" },
];
const radarData = [
  {subject:"Rating",      A:92,B:78},
  {subject:"Punctuality", A:88,B:72},
  {subject:"Safety",      A:95,B:85},
  {subject:"Revenue",     A:80,B:90},
  {subject:"Rides",       A:85,B:95},
  {subject:"Cancel",      A:90,B:70},
];
const recentRides = [
  {id:"#1042",passenger:"James Miller",driver:"Mike Smith",   from:"Manhattan",   to:"Brooklyn", status:"completed",fare:"$24.50",time:"2 min ago"},
  {id:"#1041",passenger:"Sarah Chen",  driver:"Sarah Connor", from:"LAX Airport", to:"Hollywood",status:"active",   fare:"$38.00",time:"8 min ago"},
  {id:"#1040",passenger:"Bob Wilson",  driver:"James Bond",   from:"Downtown",    to:"Airport",  status:"pending",  fare:"$0.00", time:"12 min ago"},
  {id:"#1039",passenger:"Emma Davis",  driver:"Mike Smith",   from:"Central Park",to:"Times Sq", status:"completed",fare:"$18.00",time:"25 min ago"},
  {id:"#1038",passenger:"Carlos Ruiz", driver:"Ana Lima",     from:"JFK",         to:"Midtown",  status:"completed",fare:"$52.00",time:"41 min ago"},
  {id:"#1037",passenger:"Lisa Park",   driver:"Tom Knight",   from:"Soho",        to:"Bronx",    status:"cancelled",fare:"$0.00", time:"58 min ago"},
];
const drivers = [
  {id:"D001",name:"Mike Smith",   initials:"MS",rating:4.8,rides:156,status:"online", earnings:"$4,280",vehicle:"Toyota Camry",    location:"Manhattan"},
  {id:"D002",name:"Sarah Connor", initials:"SC",rating:4.9,rides:89, status:"busy",   earnings:"$2,910",vehicle:"Honda Accord",    location:"Brooklyn"},
  {id:"D003",name:"James Bond",   initials:"JB",rating:5.0,rides:42, status:"offline",earnings:"$1,640",vehicle:"BMW 5 Series",    location:"Queens"},
  {id:"D004",name:"Ana Lima",     initials:"AL",rating:4.7,rides:203,status:"online", earnings:"$5,720",vehicle:"Ford Fusion",     location:"Bronx"},
  {id:"D005",name:"Tom Knight",   initials:"TK",rating:4.6,rides:118,status:"online", earnings:"$3,390",vehicle:"Chevrolet Malibu",location:"Staten Is."},
];
const vehicles = [
  {id:"V001",plate:"NYC-1042",model:"Toyota Camry 2023", driver:"Mike Smith",   status:"active",     mileage:"48,210 km",lastService:"Jan 15",fuel:72, lat:40.7589,lng:-73.9851},
  {id:"V002",plate:"NYC-2087",model:"Honda Accord 2022", driver:"Sarah Connor", status:"active",     mileage:"62,100 km",lastService:"Feb 2", fuel:45, lat:40.6782,lng:-73.9442},
  {id:"V003",plate:"NYC-3312",model:"BMW 5 Series 2023", driver:"James Bond",   status:"maintenance",mileage:"31,450 km",lastService:"Nov 20",fuel:88, lat:40.7282,lng:-73.7949},
  {id:"V004",plate:"NYC-4451",model:"Ford Fusion 2021",  driver:"Ana Lima",     status:"active",     mileage:"79,320 km",lastService:"Dec 10",fuel:30, lat:40.8448,lng:-73.8648},
  {id:"V005",plate:"NYC-5678",model:"Tesla Model 3 2023",driver:"Unassigned",   status:"idle",       mileage:"12,800 km",lastService:"Jan 28",fuel:91, lat:40.7549,lng:-74.0020},
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    completed:   { bg:"#dcfce7", text:"#15803d", border:"#bbf7d0" },
    active:      { bg:"#dbeafe", text:"#1d4ed8", border:"#bfdbfe" },
    pending:     { bg:"#fef9c3", text:"#a16207", border:"#fde68a" },
    cancelled:   { bg:"#fee2e2", text:"#b91c1c", border:"#fecaca" },
    online:      { bg:"#dcfce7", text:"#15803d", border:"#bbf7d0" },
    busy:        { bg:"#fef9c3", text:"#a16207", border:"#fde68a" },
    offline:     { bg:"#f1f5f9", text:"#64748b", border:"#e2e8f0" },
    maintenance: { bg:"#ffedd5", text:"#c2410c", border:"#fed7aa" },
    idle:        { bg:"#f3e8ff", text:"#7e22ce", border:"#e9d5ff" },
  };
  const s = map[status] || map.offline;
  return (
    <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}`, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.text, display:"inline-block" }}/>
      {status}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, trend, accent }) => {
  const ac = accent || C.green;
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", position:"relative", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", transition:"box-shadow 0.2s, border-color 0.2s", cursor:"default" }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.10)"; e.currentTarget.style.borderColor=ac+"60"; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor=C.border; }}>
      <div style={{ position:"absolute", top:-20, right:-20, width:72, height:72, borderRadius:"50%", background:`${ac}10` }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:`${ac}15`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${ac}25` }}>
          <Icon name={icon} size={19} color={ac}/>
        </div>
        {trend !== undefined && (
          <span style={{ display:"flex", alignItems:"center", gap:3, padding:"3px 8px", borderRadius:20, background:trend>=0?"#dcfce7":"#fee2e2", color:trend>=0?"#15803d":"#b91c1c", fontSize:11, fontWeight:700 }}>
            <Icon name={trend>=0?"arrowUp":"arrowDown"} size={10} color={trend>=0?"#15803d":"#b91c1c"}/>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:-0.5 }}>{value}</div>
      <div style={{ fontSize:12, color:C.muted, marginTop:3, fontWeight:500 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{sub}</div>}
    </div>
  );
};

const Card = ({ title, subtitle, children, action }) => (
  <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 24px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", boxShadow:"0 8px 24px rgba(0,0,0,0.12)" }}>
      {label && <div style={{ fontSize:11, color:C.muted, marginBottom:6, fontWeight:600 }}>{label}</div>}
      {payload.map((p,i) => (
        <div key={i} style={{ fontSize:12, fontWeight:700, color:p.color||C.green, marginBottom:2 }}>
          {p.name}: {typeof p.value==="number" ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

const TH = ({ c }) => <th style={{ textAlign:"left", fontSize:11, fontWeight:700, color:C.muted, padding:"10px 20px", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap", background:C.card }}>{c}</th>;
const TD = ({ children, style:s }) => <td style={{ padding:"13px 20px", fontSize:13, ...s }}>{children}</td>;
const TR = ({ children }) => {
  const [h, setH] = useState(false);
  return <tr style={{ background:h?"#f8fafc":C.panel, transition:"background 0.15s", borderBottom:`1px solid ${C.border}` }} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>{children}</tr>;
};

// ─── LIVE MAP (white-themed) ──────────────────────────────────────────────────
const LiveMap = () => {
  const [positions, setPositions] = useState(vehicles.map(v=>({lat:v.lat,lng:v.lng})));
  const [selected, setSelected] = useState(null);
  const [pulse, setPulse] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>{
      setPositions(p=>p.map((pos,i)=>vehicles[i].status==="active"?{lat:pos.lat+(Math.random()-.5)*.004,lng:pos.lng+(Math.random()-.5)*.004}:pos));
      setPulse(p=>(p+1)%3);
    },2000);
    return ()=>clearInterval(t);
  },[]);
  const latMin=40.50,latMax=40.92,lngMin=-74.28,lngMax=-73.68;
  const xy=(lat,lng,W=680,H=380)=>({x:((lng-lngMin)/(lngMax-lngMin))*W, y:H-((lat-latMin)/(latMax-latMin))*H});
  const sCol={active:"#22c55e",busy:"#f59e0b",offline:"#94a3b8",maintenance:"#f97316",idle:"#8b5cf6"};
  const boroughs=[
    {d:"M 330 35 L 368 88 L 388 168 L 376 218 L 355 242 L 325 232 L 305 192 L 316 122 Z",fill:"#e8f5e9"},
    {d:"M 325 242 L 376 230 L 442 252 L 468 322 L 428 370 L 345 360 L 296 310 Z",fill:"#f1f8e9"},
    {d:"M 388 168 L 508 148 L 568 198 L 548 288 L 468 308 L 436 252 L 376 230 L 388 218 Z",fill:"#e8f5e9"},
    {d:"M 323 35 L 402 15 L 462 62 L 482 132 L 432 142 L 388 168 L 374 132 L 346 88 Z",fill:"#f1f8e9"},
    {d:"M 120 268 L 188 250 L 222 290 L 230 355 L 180 380 L 118 362 L 100 312 Z",fill:"#e8f5e9"},
  ];
  return (
    <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:`1px solid ${C.border}` }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Live Vehicle Tracker</div>
          <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Real-time GPS — New York City</div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px 16px", justifyContent:"flex-end" }}>
          {Object.entries(sCol).map(([s,col])=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:col }}/>
              <span style={{ fontSize:11, color:C.muted, textTransform:"capitalize" }}>{s}</span>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.green }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, animation:"pulse 1.5s infinite" }}/>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:C.green }}>LIVE</span>
          </div>
        </div>
      </div>
      <div style={{ position:"relative" }}>
        <svg viewBox="0 0 680 400" style={{ width:"100%", display:"block", background:"#eef7f0" }}>
          {[...Array(7)].map((_,i)=><line key={`v${i}`} x1={i*113} y1="0" x2={i*113} y2="400" stroke="#d1ebd4" strokeWidth="1"/>)}
          {[...Array(5)].map((_,i)=><line key={`h${i}`} x1="0" y1={i*80} x2="680" y2={i*80} stroke="#d1ebd4" strokeWidth="1"/>)}
          {boroughs.map((b,i)=><path key={i} d={b.d} fill={b.fill} stroke="#b2dfb5" strokeWidth="1.5"/>)}
          {/* Roads */}
          <line x1="322" y1="0" x2="362" y2="400" stroke="#c8e6c9" strokeWidth="10"/>
          <line x1="0" y1="212" x2="680" y2="192" stroke="#c8e6c9" strokeWidth="8"/>
          <line x1="0" y1="298" x2="680" y2="278" stroke="#c8e6c9" strokeWidth="5"/>
          <line x1="0" y1="140" x2="680" y2="120" stroke="#c8e6c9" strokeWidth="4"/>
          <line x1="200" y1="0" x2="240" y2="400" stroke="#d8eeda" strokeWidth="4"/>
          {/* Labels */}
          {[{name:"MANHATTAN",x:347,y:158},{name:"BROOKLYN",x:390,y:312},{name:"QUEENS",x:480,y:228},{name:"BRONX",x:406,y:82},{name:"STATEN IS.",x:163,y:320}].map(b=>(
            <text key={b.name} x={b.x} y={b.y} textAnchor="middle" fill="#a5c8a8" fontSize="8" fontWeight="900" letterSpacing="2">{b.name}</text>
          ))}
          {/* Vehicles */}
          {vehicles.map((v,i)=>{
            const p=xy(positions[i].lat,positions[i].lng);
            const col=sCol[v.status]||"#94a3b8";
            const isSel=selected===v.id;
            const isActive=v.status==="active";
            return (
              <g key={v.id} style={{cursor:"pointer"}} onClick={()=>setSelected(isSel?null:v.id)}>
                {isActive&&<circle cx={p.x} cy={p.y} r={pulse===0?22:pulse===1?30:16} fill={col} opacity={pulse===1?0.1:0.18} style={{transition:"r 1.2s ease"}}/>}
                <circle cx={p.x} cy={p.y} r={isSel?12:9} fill={col} fillOpacity={0.2} stroke={col} strokeWidth={isSel?2.5:1.8}
                  style={{filter:`drop-shadow(0 2px 6px ${col}80)`,transition:"all 0.3s"}}/>
                <circle cx={p.x} cy={p.y} r={isSel?5.5:4} fill={col}/>
                {isSel&&(
                  <g>
                    <rect x={p.x-65} y={p.y-66} width="130" height="52" rx="8" fill="white" stroke={col} strokeWidth="1.5" style={{filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.15))"}}/>
                    <text x={p.x} y={p.y-50} textAnchor="middle" fill="#111827" fontSize="9.5" fontWeight="800">{v.plate}</text>
                    <text x={p.x} y={p.y-36} textAnchor="middle" fill="#64748b" fontSize="8.5">{v.driver}</text>
                    <text x={p.x} y={p.y-22} textAnchor="middle" fill={col} fontSize="8" fontWeight="700">{v.status.toUpperCase()} • Fuel {v.fuel}%</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// ─── PAGE: OVERVIEW ───────────────────────────────────────────────────────────
const OverviewPage = () => {
  const [period, setPeriod] = useState("year");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <StatCard icon="users"    label="Total Users"    value="1,284"    sub="+48 this month"     trend={12}/>
        <StatCard icon="car"      label="Active Drivers" value="45"       sub="12 on ride now"     trend={8}/>
        <StatCard icon="activity" label="Total Rides"    value="8,920"    sub="892 this month"     trend={23}/>
        <StatCard icon="dollar"   label="Total Revenue"  value="$154,300" sub="$15,430 this month" trend={17}/>
      </div>

      <Card title="Revenue & Ride Volume" subtitle="Monthly performance across the year"
        action={
          <div style={{display:"flex",gap:4,background:C.card,borderRadius:8,padding:4,border:`1px solid ${C.border}`}}>
            {["week","month","year"].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{padding:"4px 12px",borderRadius:6,fontSize:11,fontWeight:700,border:"none",cursor:"pointer",background:period===p?C.green:"transparent",color:period===p?"#fff":C.muted,transition:"all 0.2s"}}>{p}</button>
            ))}
          </div>
        }>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.25}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
              <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{color:C.textSoft,fontSize:12}}/>
            <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke={C.green}   fill="url(#gR)" strokeWidth={2.5} dot={false}/>
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" fill="url(#gE)" strokeWidth={2} dot={false} strokeDasharray="5 4"/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        <Card title="Rides by City" subtitle="Top performing locations">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={locationData} layout="vertical" margin={{left:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="city" tick={{fill:C.textSoft,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="rides" name="Rides" radius={[0,4,4,0]}>
                {locationData.map((_,i)=><Cell key={i} fill={`rgba(34,197,94,${1-i*0.13})`}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Fleet Breakdown" subtitle="By vehicle category">
          <ResponsiveContainer width="100%" height={155}>
            <PieChart>
              <Pie data={vehicleTypeData} cx="50%" cy="50%" innerRadius={46} outerRadius={70} paddingAngle={3} dataKey="value">
                {vehicleTypeData.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie>
              <Tooltip content={<TT/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px 12px",marginTop:6}}>
            {vehicleTypeData.map(d=>(
              <div key={d.name} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/>
                <span style={{fontSize:11,color:C.muted}}>{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Peak Hours" subtitle="Demand by hour of day">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="hour" tick={{fill:C.muted,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={h=>`${h}h`}/>
              <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="rides" name="Rides" radius={[3,3,0,0]}>
                {peakHoursData.map((d,i)=><Cell key={i} fill={d.rides>350?C.green:d.rides>150?"#86efac":"#d1fae5"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card title="Driver Performance Radar" subtitle="Top driver vs. fleet average">
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={C.border}/>
              <PolarAngleAxis dataKey="subject" tick={{fill:C.textSoft,fontSize:11}}/>
              <Radar name="Mike Smith" dataKey="A" stroke={C.green}    fill={C.green}    fillOpacity={0.2}/>
              <Radar name="Fleet Avg"  dataKey="B" stroke={C.greenDk} fill={C.greenDk} fillOpacity={0.1}/>
              <Legend wrapperStyle={{color:C.textSoft,fontSize:12}}/>
              <Tooltip content={<TT/>}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue by Location" subtitle="City-level financial overview">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={locationData}>
              <defs><linearGradient id="bG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green}/><stop offset="100%" stopColor={C.greenDk}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="city" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="revenue" name="Revenue" radius={[5,5,0,0]} fill="url(#bG)"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:`1px solid ${C.border}`}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.text}}>Recent Rides</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>Latest activity across the fleet</div>
          </div>
          <button style={{fontSize:12,color:C.green,border:`1px solid ${C.green}50`,background:C.greenLt,padding:"6px 16px",borderRadius:8,cursor:"pointer",fontWeight:700}}>View All</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["ID","Passenger","Driver","Route","Status","Fare","Time"].map(h=><TH key={h} c={h}/>)}</tr></thead>
            <tbody>
              {recentRides.map(r=>(
                <TR key={r.id}>
                  <TD style={{color:C.green,fontFamily:"monospace",fontWeight:700}}>{r.id}</TD>
                  <TD style={{color:C.text,fontWeight:500}}>{r.passenger}</TD>
                  <TD style={{color:C.textSoft}}>{r.driver}</TD>
                  <TD><span style={{color:C.textSoft}}>{r.from}</span><span style={{color:C.muted,margin:"0 6px"}}>→</span><span style={{color:C.textSoft}}>{r.to}</span></TD>
                  <TD><StatusBadge status={r.status}/></TD>
                  <TD style={{color:C.greenDk,fontWeight:700}}>{r.fare}</TD>
                  <TD style={{color:C.muted,fontSize:12}}>{r.time}</TD>
                </TR>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: TRACKING ───────────────────────────────────────────────────────────
const TrackingPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      <StatCard icon="car"   label="Active Vehicles" value="32" trend={5}/>
      <StatCard icon="tool"  label="Maintenance"     value="3"  trend={-2} accent="#f97316"/>
      <StatCard icon="clock" label="Idle Vehicles"   value="8"  accent="#8b5cf6"/>
      <StatCard icon="pin"   label="Coverage Zones"  value="5"  accent="#3b82f6"/>
    </div>
    <LiveMap/>
    <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{padding:"18px 22px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text}}>Fleet Status</div>
        <div style={{fontSize:11,color:C.muted,marginTop:2}}>Click a vehicle on the map to inspect</div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Vehicle","Plate","Driver","Status","Fuel Level","Mileage","Last Service"].map(h=><TH key={h} c={h}/>)}</tr></thead>
          <tbody>
            {vehicles.map(v=>(
              <TR key={v.id}>
                <TD style={{color:C.text,fontWeight:600}}>{v.model}</TD>
                <TD style={{color:C.green,fontFamily:"monospace",fontWeight:700}}>{v.plate}</TD>
                <TD style={{color:C.textSoft}}>{v.driver}</TD>
                <TD><StatusBadge status={v.status}/></TD>
                <TD style={{minWidth:150}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1,background:"#f1f5f9",borderRadius:4,height:6}}>
                      <div style={{height:"100%",borderRadius:4,width:`${v.fuel}%`,background:v.fuel<30?"#ef4444":v.fuel<55?"#f59e0b":C.green,transition:"width 0.5s"}}/>
                    </div>
                    <span style={{fontSize:12,color:C.muted,minWidth:32}}>{v.fuel}%</span>
                  </div>
                </TD>
                <TD style={{color:C.muted}}>{v.mileage}</TD>
                <TD style={{color:C.muted}}>{v.lastService}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── MODAL COMPONENTS ───────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: C.panel, borderRadius: 16, padding: 24,
        width: '90%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 24, cursor: 'pointer',
            color: C.muted, padding: 0, width: 30, height: 30
          }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FormField = ({ label, type, value, onChange, placeholder, options, required = false }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          style={{
            width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`,
            borderRadius: 8, fontSize: 14, background: C.card, color: C.text,
            outline: 'none', transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = C.green}
          onBlur={e => e.target.style.borderColor = C.border}
        >
          <option value="">Select {label}</option>
          {options?.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          style={{
            width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`,
            borderRadius: 8, fontSize: 14, background: C.card, color: C.text,
            outline: 'none', transition: 'border-color 0.2s', resize: 'vertical'
          }}
          onFocus={e => e.target.style.borderColor = C.green}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`,
            borderRadius: 8, fontSize: 14, background: C.card, color: C.text,
            outline: 'none', transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = C.green}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      )}
    </div>
  );
};

// ─── ADD DRIVER MODAL ───────────────────────────────────────────────────────────
const AddDriverModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', licenseNumber: '',
    vehicleType: '', experience: '', address: '', city: '', zipCode: '',
    emergencyContact: '', emergencyPhone: '', bankAccount: '', routingNumber: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding driver:', formData);
    // TODO: API call to add driver
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Driver">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="First Name" type="text" value={formData.firstName} onChange={handleChange('firstName')} required />
          <FormField label="Last Name" type="text" value={formData.lastName} onChange={handleChange('lastName')} required />
          <FormField label="Email" type="email" value={formData.email} onChange={handleChange('email')} required />
          <FormField label="Phone" type="tel" value={formData.phone} onChange={handleChange('phone')} required />
          <FormField label="License Number" type="text" value={formData.licenseNumber} onChange={handleChange('licenseNumber')} required />
          <FormField label="Vehicle Type" type="select" value={formData.vehicleType} onChange={handleChange('vehicleType')} options={[
            { value: 'sedan', label: 'Sedan' },
            { value: 'suv', label: 'SUV' },
            { value: 'luxury', label: 'Luxury' },
            { value: 'electric', label: 'Electric' },
            { value: 'van', label: 'Van' }
          ]} required />
          <FormField label="Experience (years)" type="number" value={formData.experience} onChange={handleChange('experience')} />
          <FormField label="City" type="text" value={formData.city} onChange={handleChange('city')} required />
        </div>

        <FormField label="Address" type="text" value={formData.address} onChange={handleChange('address')} required />
        <FormField label="ZIP Code" type="text" value={formData.zipCode} onChange={handleChange('zipCode')} required />

        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '20px 0 10px', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
          Emergency Contact
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Contact Name" type="text" value={formData.emergencyContact} onChange={handleChange('emergencyContact')} />
          <FormField label="Contact Phone" type="tel" value={formData.emergencyPhone} onChange={handleChange('emergencyPhone')} />
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '20px 0 10px', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
          Banking Information
        </div>
        <FormField label="Bank Account Number" type="text" value={formData.bankAccount} onChange={handleChange('bankAccount')} />
        <FormField label="Routing Number" type="text" value={formData.routingNumber} onChange={handleChange('routingNumber')} />

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" style={{
            flex: 1, background: C.green, color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseEnter={e => e.target.style.background = C.greenDk}
            onMouseLeave={e => e.target.style.background = C.green}>
            Add Driver
          </button>
          <button type="button" onClick={onClose} style={{
            flex: 1, background: C.card, color: C.text, border: `1px solid ${C.border}`,
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseEnter={e => e.target.style.background = C.bg}
            onMouseLeave={e => e.target.style.background = C.card}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── ADD VEHICLE MODAL ───────────────────────────────────────────────────────────
const AddVehicleModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', plateNumber: '', vin: '', color: '',
    vehicleType: '', seats: '', fuelType: '', transmission: '', mileage: '',
    insuranceNumber: '', insuranceExpiry: '', lastServiceDate: '', nextServiceDate: '',
    availabilityStatus: 'available', driverAssigned: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding vehicle:', formData);
    onClose();
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle">
      <form onSubmit={handleSubmit}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 10px', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
          Vehicle Information
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Make" type="text" value={formData.make} onChange={handleChange('make')} required />
          <FormField label="Model" type="text" value={formData.model} onChange={handleChange('model')} required />
          <FormField label="Year" type="number" value={formData.year} onChange={handleChange('year')} required />
          <FormField label="Plate Number" type="text" value={formData.plateNumber} onChange={handleChange('plateNumber')} required />
          <FormField label="VIN" type="text" value={formData.vin} onChange={handleChange('vin')} required />
          <FormField label="Color" type="text" value={formData.color} onChange={handleChange('color')} required />
          <FormField label="Vehicle Type" type="select" value={formData.vehicleType} onChange={handleChange('vehicleType')} options={[
            { value: 'sedan', label: 'Sedan' },
            { value: 'suv', label: 'SUV' },
            { value: 'luxury', label: 'Luxury' },
            { value: 'electric', label: 'Electric' },
            { value: 'van', label: 'Van' }
          ]} required />
          <FormField label="Number of Seats" type="number" value={formData.seats} onChange={handleChange('seats')} required />
          <FormField label="Fuel Type" type="select" value={formData.fuelType} onChange={handleChange('fuelType')} options={[
            { value: 'gasoline', label: 'Gasoline' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'electric', label: 'Electric' },
            { value: 'hybrid', label: 'Hybrid' }
          ]} required />
          <FormField label="Transmission" type="select" value={formData.transmission} onChange={handleChange('transmission')} options={[
            { value: 'manual', label: 'Manual' },
            { value: 'automatic', label: 'Automatic' }
          ]} required />
        </div>

        <FormField label="Current Mileage" type="number" value={formData.mileage} onChange={handleChange('mileage')} required />

        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '20px 0 10px', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
          Insurance Information
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Insurance Number" type="text" value={formData.insuranceNumber} onChange={handleChange('insuranceNumber')} required />
          <FormField label="Insurance Expiry" type="date" value={formData.insuranceExpiry} onChange={handleChange('insuranceExpiry')} required />
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '20px 0 10px', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
          Service Information
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FormField label="Last Service Date" type="date" value={formData.lastServiceDate} onChange={handleChange('lastServiceDate')} />
          <FormField label="Next Service Date" type="date" value={formData.nextServiceDate} onChange={handleChange('nextServiceDate')} />
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '20px 0 10px', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
          Availability
        </div>
        <FormField label="Availability Status" type="select" value={formData.availabilityStatus} onChange={handleChange('availabilityStatus')} options={[
          { value: 'available', label: 'Available' },
          { value: 'unavailable', label: 'Unavailable' },
          { value: 'maintenance', label: 'Under Maintenance' },
          { value: 'assigned', label: 'Assigned to Driver' }
        ]} required />
        <FormField label="Assigned Driver" type="select" value={formData.driverAssigned} onChange={handleChange('driverAssigned')} options={[
          { value: '', label: 'Unassigned' },
          ...drivers.map(d => ({ value: d.id, label: d.name }))
        ]} />

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" style={{
            flex: 1, background: C.green, color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseEnter={e => e.target.style.background = C.greenDk}
            onMouseLeave={e => e.target.style.background = C.green}>
            Add Vehicle
          </button>
          <button type="button" onClick={onClose} style={{
            flex: 1, background: C.card, color: C.text, border: `1px solid ${C.border}`,
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseEnter={e => e.target.style.background = C.bg}
            onMouseLeave={e => e.target.style.background = C.card}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── VEHICLE AVAILABILITY MODAL ───────────────────────────────────────────────────
const VehicleAvailabilityModal = ({ isOpen, onClose, vehicle }) => {
  const [availability, setAvailability] = useState(vehicle?.status || 'idle');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updating vehicle availability:', { vehicleId: vehicle?.id, availability, notes });
    // TODO: API call to update vehicle availability
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Vehicle Availability">
      <form onSubmit={handleSubmit}>
        {vehicle && (
          <div style={{
            background: C.card, padding: 12, borderRadius: 8, marginBottom: 16,
            border: `1px solid ${C.border}`
          }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Vehicle</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{vehicle.model}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Plate: {vehicle.plate}</div>
          </div>
        )}

        <FormField
          label="Availability Status"
          type="select"
          value={availability}
          onChange={e => setAvailability(e.target.value)}
          options={[
            { value: 'active', label: 'Active - Available for rides' },
            { value: 'idle', label: 'Idle - Available but not in use' },
            { value: 'maintenance', label: 'Under Maintenance' },
            { value: 'unavailable', label: 'Unavailable - Out of service' },
            { value: 'assigned', label: 'Assigned to Driver' }
          ]}
        />

        <FormField
          label="Notes"
          type="textarea"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any notes about this availability change..."
        />

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button type="submit" style={{
            flex: 1, background: C.green, color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseEnter={e => e.target.style.background = C.greenDk}
            onMouseLeave={e => e.target.style.background = C.green}>
            Update Availability
          </button>
          <button type="button" onClick={onClose} style={{
            flex: 1, background: C.card, color: C.text, border: `1px solid ${C.border}`,
            padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'background 0.2s'
          }} onMouseEnter={e => e.target.style.background = C.bg}
            onMouseLeave={e => e.target.style.background = C.card}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── PAGE: DRIVERS ────────────────────────────────────────────────────────────
const DriversPage = () => {
  const [search, setSearch] = useState("");
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const filtered = drivers.filter(d=>d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <StatCard icon="users" label="Online Drivers" value={drivers.filter(d=>d.status==="online").length}/>
        <StatCard icon="car"   label="On Ride"        value={drivers.filter(d=>d.status==="busy").length} accent="#f59e0b"/>
        <StatCard icon="user"  label="Offline"        value={drivers.filter(d=>d.status==="offline").length} accent="#94a3b8"/>
        <StatCard icon="star"  label="Avg Rating"     value="4.8" trend={2} accent="#eab308"/>
      </div>
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text}}>Driver Roster</div>
          <div style={{display:"flex",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px"}}>
              <Icon name="search" size={14} color={C.muted}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search driver..." style={{background:"transparent",border:"none",outline:"none",fontSize:12,color:C.text,width:140}}/>
            </div>
            <button
              onClick={() => setShowAddDriverModal(true)}
              style={{display:"flex",alignItems:"center",gap:6,background:C.green,color:"#fff",fontSize:12,fontWeight:700,border:"none",padding:"7px 16px",borderRadius:8,cursor:"pointer"}}>
              <Icon name="plus" size={14} color="#fff"/> Add Driver
            </button>
          </div>
        </div>
        {filtered.map(d=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:16,padding:"15px 22px",borderBottom:`1px solid ${C.border}`,transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.card}
            onMouseLeave={e=>e.currentTarget.style.background=C.panel}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDk},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:14,flexshrink:0}}>{d.initials}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:C.text,fontWeight:700,fontSize:14}}>{d.name}</span>
                <StatusBadge status={d.status}/>
              </div>
              <div style={{color:C.muted,fontSize:11,marginTop:2}}>{d.vehicle} · {d.location}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                <Icon name="star" size={13} color="#eab308"/>
                <span style={{color:C.text,fontWeight:800,fontSize:14}}>{d.rating}</span>
              </div>
              <div style={{color:C.muted,fontSize:11}}>{d.rides} rides</div>
            </div>
            <div style={{textAlign:"center",minWidth:80}}>
              <div style={{color:C.greenDk,fontWeight:800,fontSize:14}}>{d.earnings}</div>
              <div style={{color:C.muted,fontSize:11}}>earnings</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.green,border:`1px solid ${C.green}50`,background:C.greenLt,padding:"5px 12px",borderRadius:7,cursor:"pointer",fontWeight:600}}>
                <Icon name="eye" size={13} color={C.green}/> View
              </button>
              <button style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.textSoft,border:`1px solid ${C.border}`,background:C.card,padding:"5px 12px",borderRadius:7,cursor:"pointer",fontWeight:600}}>
                <Icon name="edit" size={13} color={C.textSoft}/> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddDriverModal isOpen={showAddDriverModal} onClose={() => setShowAddDriverModal(false)} />
    </div>
  );
};

// ─── PAGE: ANALYTICS ─────────────────────────────────────────────────────────
const AnalyticsPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card title="Monthly Revenue Trend" subtitle="Revenue vs. Expenses — 12 months">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{color:C.textSoft,fontSize:12}}/>
            <Line type="monotone" dataKey="revenue"  name="Revenue"  stroke={C.green}   strokeWidth={2.5} dot={{fill:C.green,r:3}} activeDot={{r:6}}/>
            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} dot={{fill:"#f59e0b",r:3}} strokeDasharray="5 4"/>
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Rides & Drivers by City" subtitle="Comparative city performance">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="city" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{color:C.textSoft,fontSize:12}}/>
            <Bar dataKey="rides"   name="Rides"   radius={[4,4,0,0]} fill={C.green}/>
            <Bar dataKey="drivers" name="Drivers" radius={[4,4,0,0]} fill={C.greenDk}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Demand Heatmap" subtitle="Hourly ride volume — 24 hour cycle">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={peakHoursData}>
            <defs><linearGradient id="pH" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.35}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="hour" tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={h=>`${h}h`}/>
            <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<TT/>}/>
            <Area type="monotone" dataKey="rides" name="Rides" stroke={C.green} fill="url(#pH)" strokeWidth={2.5} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Driver Performance Radar" subtitle="Multi-metric analysis">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} outerRadius={80}>
            <PolarGrid stroke={C.border}/>
            <PolarAngleAxis dataKey="subject" tick={{fill:C.textSoft,fontSize:11}}/>
            <Radar name="Top Driver" dataKey="A" stroke={C.green}    fill={C.green}    fillOpacity={0.25}/>
            <Radar name="Fleet Avg"  dataKey="B" stroke={C.greenDk} fill={C.greenDk} fillOpacity={0.12}/>
            <Legend wrapperStyle={{color:C.textSoft,fontSize:12}}/>
            <Tooltip content={<TT/>}/>
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card title="Revenue by Location — Detailed" subtitle="Full city financial breakdown">
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={locationData}>
          <defs><linearGradient id="lG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green}/><stop offset="100%" stopColor={C.greenDk}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
          <XAxis dataKey="city" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
          <Tooltip content={<TT/>}/>
          <Bar dataKey="revenue" name="Revenue" radius={[6,6,0,0]} fill="url(#lG)"/>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);

// ─── PAGE: FINANCIALS ─────────────────────────────────────────────────────────
const FinancialsPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      <StatCard icon="dollar"   label="Gross Revenue"  value="$154,300" sub="This year"      trend={22}/>
      <StatCard icon="trending" label="Net Profit"     value="$98,420"  sub="After expenses" trend={18}/>
      <StatCard icon="car"      label="Average Fare"   value="$24.80"   sub="Per ride"       trend={5}/>
      <StatCard icon="users"    label="Driver Payouts" value="$42,100"  sub="This year"      trend={12}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card title="Monthly P&L" subtitle="Revenue vs. Expenses by month">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{color:C.textSoft,fontSize:12}}/>
            <Bar dataKey="revenue"  name="Revenue"  radius={[4,4,0,0]} fill={C.green}/>
            <Bar dataKey="expenses" name="Expenses" radius={[4,4,0,0]} fill="#fcd34d"/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card title="Revenue Share by Fleet Type" subtitle="Fare distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={vehicleTypeData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,value})=>`${name} ${value}%`} labelLine={{stroke:C.border}}>
              {vehicleTypeData.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
            <Tooltip content={<TT/>}/>
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);

// ─── PAGE: VEHICLES ───────────────────────────────────────────────────────────
const VehiclesPage = () => {
  const [search, setSearch] = useState("");
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const filtered = vehicles.filter(v=>
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.driver.toLowerCase().includes(search.toLowerCase())
  );

  const handleAvailabilityClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowAvailabilityModal(true);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <StatCard icon="car"   label="Total Vehicles" value={vehicles.length} trend={3}/>
        <StatCard icon="tool"  label="Active"        value={vehicles.filter(v=>v.status==="active").length} accent="#22c55e"/>
        <StatCard icon="clock" label="Maintenance"    value={vehicles.filter(v=>v.status==="maintenance").length} accent="#f97316"/>
        <StatCard icon="pin"   label="Idle"          value={vehicles.filter(v=>v.status==="idle").length} accent="#8b5cf6"/>
      </div>

      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text}}>Vehicle Fleet</div>
          <div style={{display:"flex",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px"}}>
              <Icon name="search" size={14} color={C.muted}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vehicle..." style={{background:"transparent",border:"none",outline:"none",fontSize:12,color:C.text,width:140}}/>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              style={{display:"flex",alignItems:"center",gap:6,background:C.green,color:"#fff",fontSize:12,fontWeight:700,border:"none",padding:"7px 16px",borderRadius:8,cursor:"pointer"}}>
              <Icon name="plus" size={14} color="#fff"/> Add Vehicle
            </button>
          </div>
        </div>

        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>
                {["Vehicle","Plate","Driver","Status","Fuel","Mileage","Last Service","Actions"].map(h=><TH key={h} c={h}/>)}</tr>
            </thead>
            <tbody>
              {filtered.map(v=>(
                <TR key={v.id}>
                  <TD style={{color:C.text,fontWeight:600}}>{v.model}</TD>
                  <TD style={{color:C.green,fontFamily:"monospace",fontWeight:700}}>{v.plate}</TD>
                  <TD style={{color:C.textSoft}}>{v.driver}</TD>
                  <TD><StatusBadge status={v.status}/></TD>
                  <TD style={{minWidth:150}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{flex:1,background:"#f1f5f9",borderRadius:4,height:6}}>
                        <div style={{height:"100%",borderRadius:4,width:`${v.fuel}%`,background:v.fuel<30?"#ef4444":v.fuel<55?"#f59e0b":C.green,transition:"width 0.5s"}}/>
                      </div>
                      <span style={{fontSize:12,color:C.muted,minWidth:32}}>{v.fuel}%</span>
                    </div>
                  </TD>
                  <TD style={{color:C.muted}}>{v.mileage}</TD>
                  <TD style={{color:C.muted}}>{v.lastService}</TD>
                  <TD>
                    <div style={{display:"flex",gap:8}}>
                      <button
                        onClick={() => handleAvailabilityClick(v)}
                        style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.green,border:`1px solid ${C.green}50`,background:C.greenLt,padding:"5px 12px",borderRadius:7,cursor:"pointer",fontWeight:600}}>
                        <Icon name="settings" size={13} color={C.green}/> Availability
                      </button>
                      <button style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.textSoft,border:`1px solid ${C.border}`,background:C.card,padding:"5px 12px",borderRadius:7,cursor:"pointer",fontWeight:600}}>
                        <Icon name="edit" size={13} color={C.textSoft}/> Edit
                      </button>
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddVehicleModal isOpen={showAddVehicleModal} onClose={() => setShowAddVehicleModal(false)} />
      <VehicleAvailabilityModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

// ─── PAGE: RIDES ──────────────────────────────────────────────────────────────
const RidesPage = () => {
  const [filter, setFilter] = useState("All");
  const filters = ["All","Completed","Active","Pending","Cancelled"];
  const filtered = filter==="All"?recentRides:recentRides.filter(r=>r.status===filter.toLowerCase());
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <StatCard icon="check"    label="Completed"  value="7,840" trend={15}/>
        <StatCard icon="activity" label="Active Now"  value="12"   accent="#3b82f6"/>
        <StatCard icon="clock"    label="Pending"    value="28"    accent="#f59e0b"/>
        <StatCard icon="xIcon"    label="Cancelled"  value="52"    trend={-8} accent="#ef4444"/>
      </div>
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text}}>All Rides</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {filters.map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{fontSize:12,fontWeight:600,padding:"5px 14px",borderRadius:7,border:`1px solid ${filter===f?C.green:C.border}`,background:filter===f?C.greenLt:"transparent",color:filter===f?C.greenDk:C.muted,cursor:"pointer",transition:"all 0.2s"}}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["ID","Passenger","Driver","Route","Status","Fare","Time"].map(h=><TH key={h} c={h}/>)}</tr></thead>
            <tbody>
              {filtered.map(r=>(
                <TR key={r.id}>
                  <TD style={{color:C.green,fontFamily:"monospace",fontWeight:700}}>{r.id}</TD>
                  <TD style={{color:C.text,fontWeight:500}}>{r.passenger}</TD>
                  <TD style={{color:C.textSoft}}>{r.driver}</TD>
                  <TD><span style={{color:C.textSoft}}>{r.from}</span><span style={{color:C.muted,margin:"0 6px"}}>→</span><span style={{color:C.textSoft}}>{r.to}</span></TD>
                  <TD><StatusBadge status={r.status}/></TD>
                  <TD style={{color:C.greenDk,fontWeight:700}}>{r.fare}</TD>
                  <TD style={{color:C.muted,fontSize:12}}>{r.time}</TD>
                </TR>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: SETTINGS ───────────────────────────────────────────────────────────
const SettingsPage = () => {
  const [notifs, setNotifs] = useState({email:true,sms:false,ride:true});
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:640}}>
      {[
        {section:"General",fields:[
          {label:"Platform Name",    type:"text",  value:"Nova Transport Admin"},
          {label:"Support Email",    type:"email", value:"admin@novatransport.rw"},
          {label:"Default Currency", type:"select",options:["USD","EUR","GBP"]},
        ]},
        {section:"Notifications",fields:[
          {label:"Email Alerts",           type:"toggle",key:"email"},
          {label:"SMS Notifications",      type:"toggle",key:"sms"},
          {label:"Ride Completion Alerts", type:"toggle",key:"ride"},
        ]},
        {section:"Billing",fields:[
          {label:"Platform Commission (%)", type:"number",value:"15"},
          {label:"Minimum Fare ($)",        type:"number",value:"5.00"},
        ]},
      ].map(sec=>(
        <div key={sec.section} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:16,padding:"20px 24px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:11,fontWeight:800,color:C.green,marginBottom:16,paddingBottom:12,borderBottom:`1px solid ${C.border}`,letterSpacing:2,textTransform:"uppercase"}}>{sec.section}</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {sec.fields.map(f=>(
              <div key={f.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:C.textSoft}}>{f.label}</span>
                {f.type==="toggle"?(
                  <button onClick={()=>setNotifs(p=>({...p,[f.key]:!p[f.key]}))}
                    style={{width:48,height:26,borderRadius:13,border:"none",cursor:"pointer",background:notifs[f.key]?C.green:"#e2e8f0",position:"relative",transition:"background 0.25s"}}>
                    <span style={{position:"absolute",top:3,left:notifs[f.key]?26:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
                  </button>
                ):f.type==="select"?(
                  <select style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",fontSize:13,color:C.text,outline:"none"}}>
                    {f.options.map(o=><option key={o}>{o}</option>)}
                  </select>
                ):(
                  <input type={f.type} defaultValue={f.value}
                    style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",fontSize:13,color:C.text,outline:"none",width:180,transition:"border-color 0.2s"}}
                    onFocus={e=>e.target.style.borderColor=C.green}
                    onBlur={e=>e.target.style.borderColor=C.border}/>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button style={{display:"flex",alignItems:"center",gap:8,background:C.green,color:"#fff",fontWeight:700,fontSize:13,border:"none",padding:"12px 24px",borderRadius:10,cursor:"pointer",alignSelf:"flex-start",boxShadow:`0 4px 12px ${C.green}40`}}>
        <Icon name="save" size={15} color="#fff"/> Save Changes
      </button>
    </div>
  );
};

// ─── SIDEBAR + APP ────────────────────────────────────────────────────────────
const NAV = [
  {id:"overview",  icon:"grid",    label:"Overview"},
  {id:"tracking",  icon:"map",     label:"Live Tracking"},
  {id:"rides",     icon:"car",     label:"Rides"},
  {id:"drivers",   icon:"users",   label:"Drivers"},
  {id:"vehicles",  icon:"car",     label:"Vehicles"},
  {id:"analytics", icon:"barChart",label:"Analytics"},
  {id:"financials",icon:"dollar",  label:"Financials"},
  {id:"settings",  icon:"settings",label:"Settings"},
];
const PAGES = {overview:OverviewPage,tracking:TrackingPage,rides:RidesPage,drivers:DriversPage,vehicles:VehiclesPage,analytics:AnalyticsPage,financials:FinancialsPage,settings:SettingsPage};
const TITLES = {overview:"Overview",tracking:"Live Vehicle Tracking",rides:"Ride Management",drivers:"Driver Management",vehicles:"Vehicle Management",analytics:"Analytics & Insights",financials:"Financials",settings:"Settings"};

export default function AdminDashboard() {
  const [page, setPage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const Page = PAGES[page];
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("You have successfully logged out!");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const SidebarContent = () => (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,0.1)",flexshrink:0}}>
        <img src="/logo.png" alt="Nova Transport Logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
        {!collapsed&&(
          <div>
            <div style={{fontSize:15,fontWeight:900,color:"#fff",letterSpacing:-0.5,lineHeight:1}}>Nova Transport</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:3,fontWeight:700,letterSpacing:1}}>ADMIN PANEL</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
        {NAV.map(n=>{
          const active=page===n.id;
          return (
            <button key={n.id} onClick={()=>setPage(n.id)}
              style={{display:"flex",alignItems:"center",gap:12,padding:collapsed?"11px 11px":"11px 14px",borderRadius:10,border:"none",cursor:"pointer",width:"100%",textAlign:"left",
                background:active?`${C.green}25`:"transparent",
                borderLeft:active?`3px solid ${C.green}`:"3px solid transparent",
                color:active?C.green:"rgba(255,255,255,0.55)",transition:"all 0.2s"}}
              onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.color="rgba(255,255,255,0.85)";}}}
              onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}}
            >
              <Icon name={n.icon} size={17} color={active?C.green:"currentColor"}/>
              {!collapsed&&<span style={{fontSize:13,fontWeight:active?700:500,flex:1}}>{n.label}</span>}
              {!collapsed&&active&&<span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexshrink:0}}/>}
            </button>
          );
        })}
      </nav>

      {/* Driver status */}
      {!collapsed&&(
        <div style={{margin:"0 8px 8px",padding:"14px 16px",background:"rgba(255,255,255,0.06)",borderRadius:12,border:"1px solid rgba(255,255,255,0.09)",flexshrink:0}}>
          <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.35)",letterSpacing:1.5,marginBottom:10}}>DRIVER STATUS</div>
          {[{label:"Online",count:28,color:C.green},{label:"On Ride",count:12,color:"#f59e0b"},{label:"Offline",count:5,color:"rgba(255,255,255,0.3)"}].map(s=>(
            <div key={s.label} style={{display:"flex",justifyContent:"space-between",marginBottom:7,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:s.color}}/>
                <span style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>{s.label}</span>
              </div>
              <span style={{fontSize:12,fontWeight:800,color:"rgba(255,255,255,0.7)"}}>{s.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <div style={{padding:"12px 8px",borderTop:"1px solid rgba(255,255,255,0.08)",flexshrink:0}}>
        <button
          onClick={handleLogout}
          style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:"none",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer",width:"100%",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.15)";e.currentTarget.style.color="#ef4444";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.4)";}}>
          <Icon name="logout" size={16} color="currentColor"/>
          {!collapsed&&<span style={{fontSize:13,fontWeight:600}}>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      {/* Sidebar — dark */}
      <div style={{width:collapsed?62:228,flexshrink:0,background:C.sidebar,transition:"width 0.3s ease",overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <SidebarContent/>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        {/* Header */}
        <header style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:60,display:"flex",alignItems:"center",gap:16,flexshrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
          <button onClick={()=>setCollapsed(c=>!c)}
            style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexshrink:0,transition:"border-color 0.2s"}}>
            <Icon name="menu" size={16} color={C.muted}/>
          </button>

          <div style={{minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,color:C.text,whiteSpace:"nowrap"}}>{TITLES[page]}</div>
            <div style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>

          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10,flexshrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px"}}>
              <Icon name="search" size={14} color={C.muted}/>
              <input placeholder="Search..." style={{background:"transparent",border:"none",outline:"none",fontSize:12,color:C.text,width:130}}/>
            </div>
            <div style={{position:"relative"}}>
              <button style={{width:36,height:36,background:C.card,border:`1px solid ${C.border}`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <Icon name="bell" size={16} color={C.muted}/>
              </button>
              <span style={{position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:"#ef4444",fontSize:9,fontWeight:800,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>4</span>
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.greenDk},${C.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,color:"#fff",boxShadow:`0 0 10px ${C.green}40`,flexshrink:0}}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,overflowY:"auto",padding:24,overflowX:"hidden"}}>
          <Page/>
        </main>
      </div>
    </div>
  );
}
