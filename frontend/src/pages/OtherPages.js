// DeliveryPage.js
import React, { useState, useEffect } from 'react';
import { Card, StatCard, StatusBadge, Button } from '../components/UI';
import { get } from '../utils/api';

const PLATFORM_CONFIG = {
  swiggy: { color: '#FC8019', bg: '#fff5ee', icon: 'SW', label: 'Swiggy' },
  zomato: { color: '#E23744', bg: '#fff0f1', icon: '', label: 'Zomato' },
};

export function DeliveryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([get('/delivery'), get('/delivery/stats')]).then(([d, s]) => { setDeliveries(d); setStats(s); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" /></div>;

  return (
    <div className="p-6 fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Deliveries" value={stats?.active || 0} icon="truck" accentColor="#FF6B35" />
        <StatCard label="Avg Delivery Time" value="28m" sub="Today's avg" icon="" accentColor="#28A745" />
        <StatCard label="Swiggy Orders" value={stats?.swiggy || 0} icon="🟠" accentColor="#FC8019" />
        <StatCard label="Zomato Orders" value={stats?.zomato || 0} icon="" accentColor="#E23744" />
      </div>

      {/* Map Placeholder */}
      <Card className="mb-4">
        <div className="relative overflow-hidden rounded-xl" style={{ height: '180px' }}>
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80" alt="Map" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl block mb-2"></span>
              <p className="font-medium text-sm" style={{ color: '#333' }}>Live Delivery Map</p>
              <p className="text-xs" style={{ color: '#666' }}>GPS tracking active for {stats?.active || 0} riders</p>
            </div>
          </div>
          {/* Fake rider pins */}
          {[{x:'20%',y:'40%',c:'#FC8019'},{x:'60%',y:'30%',c:'#E23744'},{x:'75%',y:'60%',c:'#FC8019'}].map((pin,i) => (
            <div key={i} className="absolute w-6 h-6 rounded-full flex items-center justify-center text-xs text-white pulse-dot"
              style={{ left: pin.x, top: pin.y, background: pin.c, boxShadow: `0 0 8px ${pin.c}80` }}></div>
          ))}
        </div>
      </Card>

      {/* Delivery List */}
      <div className="space-y-3">
        {deliveries.map(d => {
          const plat = PLATFORM_CONFIG[d.platform] || PLATFORM_CONFIG.swiggy;
          return (
            <Card key={d._id}>
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: plat.bg }}>{plat.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-bold" style={{ color: plat.color }}>{d.orderId}</span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-sm font-medium truncate" style={{ color: '#1E1E1E' }}>{d.customer}</p>
                  <p className="text-xs truncate" style={{ color: '#aaa' }}> {d.address} · {d.distance} km</p>
                  {d.rider && <p className="text-xs mt-0.5" style={{ color: '#666' }}> {d.rider} · {d.riderPhone}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: '#1E1E1E' }}>₹{d.amount}</p>
                  {d.eta > 0 && <p className="text-xs mt-0.5" style={{ color: d.eta <= 10 ? '#28A745' : '#FF6B35' }}>ETA {d.eta}m</p>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// QRPage.js
export function QRPage() {
  const tables = Array.from({length:12}, (_,i) => i+1);
  return (
    <div className="p-6 fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="QR Scans Today" value="84" trend={12} icon="mobile" accentColor="#FF6B35" />
        <StatCard label="Orders via QR" value="31" trend={8} icon="" accentColor="#28A745" />
        <StatCard label="Avg QR Value" value="₹410" trend={5} icon="revenue" accentColor="#FFC107" />
      </div>
      <Card>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#f5f5f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Table QR Codes</h3>
          <Button size="sm" onClick={() => alert('Downloading all QR codes as PDF...')}>Download All PDFs</Button>
        </div>
        <div className="p-4 grid grid-cols-3 lg:grid-cols-6 gap-4">
          {tables.map(t => (
            <div key={t} className="text-center card-hover cursor-pointer" onClick={() => alert(`Opening QR for Table ${t}`)}>
              <div className="w-full aspect-square rounded-xl flex items-center justify-center mb-2 relative overflow-hidden"
                style={{ background: '#f8f9fa', border: '2px solid #f0f0f0' }}>
                <div className="grid grid-cols-5 gap-0.5 opacity-50">
                  {Array.from({length:25},(_,i) => <div key={i} className="w-2 h-2 rounded-sm" style={{ background: Math.random() > 0.4 ? '#1E1E1E' : 'transparent' }} />)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold" style={{ color: '#FF6B35' }}>T{t}</div>
                </div>
              </div>
              <p className="text-xs font-medium" style={{ color: '#333' }}>Table {t}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ReportsPage.js
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function ReportsPage() {
  const channelData = [
    { channel: 'Dine-in', value: 42160, color: '#FF6B35' },
    { channel: 'Swiggy', value: 19870, color: '#FC8019' },
    { channel: 'Zomato', value: 14240, color: '#E23744' },
    { channel: 'Takeaway', value: 8050, color: '#17a2b8' },
  ];
  return (
    <div className="p-6 fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Gross Revenue" value="₹84,320" icon="revenue" accentColor="#FF6B35" />
        <StatCard label="Net Revenue" value="₹81,732" trend={8} icon="trend" accentColor="#28A745" />
        <StatCard label="Food Cost %" value="28.4%" sub="Target: 30%" icon="kitchen" accentColor="#FFC107" />
        <StatCard label="Gross Profit" value="₹57,774" trend={12} icon="check" accentColor="#28A745" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="p-4 border-b" style={{ borderColor: '#f5f5f5' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Channel Sales</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={channelData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="channel" tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {channelData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="p-4 border-b" style={{ borderColor: '#f5f5f5' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>P&L Summary</h3>
          </div>
          <div className="p-4">
            {[
              { label: 'Gross Revenue', value: '₹84,320', color: '#1E1E1E' },
              { label: 'Discounts & Offers', value: '-₹6,480', color: '#DC3545' },
              { label: 'GST (5%)', value: '₹3,892', color: '#666' },
              { label: 'Net Revenue', value: '₹81,732', color: '#FF6B35', bold: true },
              { label: 'Food Cost (28%)', value: '-₹23,958', color: '#DC3545' },
              { label: 'Gross Profit', value: '₹57,774', color: '#28A745', bold: true },
            ].map((row, i) => (
              <div key={i} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: '#f5f5f5' }}>
                <span className="text-sm" style={{ color: '#666' }}>{row.label}</span>
                <span className={`text-sm ${row.bold ? 'font-bold' : 'font-medium'}`} style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="text-center">
        <Button onClick={() => alert('Generating PDF report...')}> Export Full Report PDF</Button>
      </div>
    </div>
  );
}

// AnalyticsPage.js
export function AnalyticsPage() {
  const branchData = [
    { branch: 'Koregaon Park', revenue: 840000, orders: 2400 },
    { branch: 'Baner', revenue: 710000, orders: 2100 },
    { branch: 'Viman Nagar', revenue: 590000, orders: 1800 },
    { branch: 'Kothrud', revenue: 340000, orders: 980 },
  ];
  return (
    <div className="p-6 fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Monthly Revenue" value="₹24.8L" trend={18} icon="revenue" accentColor="#FF6B35" />
        <StatCard label="Avg Order Value" value="₹485" trend={5.2} icon="" accentColor="#28A745" />
        <StatCard label="Repeat Customers" value="68%" trend={3} icon="users" accentColor="#FFC107" />
        <StatCard label="Food Cost %" value="28.4%" sub="Target 30%" icon="kitchen" accentColor="#17a2b8" />
      </div>
      <Card>
        <div className="p-4 border-b" style={{ borderColor: '#f5f5f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Branch Performance</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={branchData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis dataKey="branch" tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip formatter={v => `₹${(v/100000).toFixed(1)}L`} />
              <Bar dataKey="revenue" fill="#FF6B35" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
