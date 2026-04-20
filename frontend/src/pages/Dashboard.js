import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, StatCard, StatusBadge } from '../components/UI';
import { get } from '../utils/api';

const PIE_COLORS = ['#FF6B35', '#28A745', '#FFC107', '#1E7BC4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl shadow-lg text-xs" style={{ background: '#1E1E1E', color: '#fff', border: 'none' }}>
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>₹{p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/dashboard/stats').then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" />
    </div>
  );

  if (!stats) return <div className="p-6 text-gray-400">Failed to load dashboard data.</div>;

  return (
    <div className="p-6 space-y-6 fade-in">
      {/* Hero Banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1E1E 0%, #2d1a0a 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #FF6B35 0%, transparent 60%)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm mb-1" style={{ color: '#FF6B35' }}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} </p>
            <h2 className="text-2xl font-display font-bold text-white">Here's what's happening today</h2>
            <p className="text-sm mt-1" style={{ color: '#888' }}>Real-time restaurant overview</p>
          </div>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" alt="Restaurant"
            className="hidden md:block w-32 h-20 object-cover rounded-xl opacity-40" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Revenue" value={`₹${stats.revenue.today.toLocaleString()}`} trend={stats.revenue.growth} sub="vs yesterday" icon="revenue" accentColor="#FF6B35" />
        <StatCard label="Orders Today" value={stats.orders.today} trend={stats.orders.growth} sub="vs yesterday" icon="orders" accentColor="#28A745" />
        <StatCard label="Tables Occupied" value={`${stats.tables.occupied}/${stats.tables.total}`} sub={`${Math.round(stats.tables.occupied/stats.tables.total*100)}% occupancy`} icon="tables" accentColor="#FFC107" />
        <StatCard label="Avg Rating" value="4.7 " trend={0.2} sub="this week" icon="rating" accentColor="#DC3545" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hourly Revenue Bar */}
        <Card className="lg:col-span-2">
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#f5f5f5' }}>
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Hourly Revenue</h3>
              <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>Today's performance</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: '#fff3ef', color: '#FF6B35' }}>Today</span>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.hourlyRevenue} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#FF6B35" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Mix Pie */}
        <Card>
          <div className="p-4 border-b" style={{ borderColor: '#f5f5f5' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Order Channels</h3>
            <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>Distribution today</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={stats.orderMix} dataKey="value" nameKey="channel" cx="50%" cy="50%" innerRadius={40} outerRadius={60}>
                  {stats.orderMix.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {stats.orderMix.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span style={{ color: '#666' }}>{item.channel}</span>
                  </div>
                  <span className="font-medium" style={{ color: '#333' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Trend + Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="p-4 border-b" style={{ borderColor: '#f5f5f5' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Weekly Revenue Trend</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stats.weeklyRevenue} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#aaa' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#FF6B35" strokeWidth={2.5} dot={{ fill: '#FF6B35', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-4 border-b" style={{ borderColor: '#f5f5f5' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Top Dishes</h3>
          </div>
          <div className="p-4 space-y-3">
            {stats.topDishes.slice(0,5).map((dish, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: i === 0 ? '#FF6B35' : i === 1 ? '#FFC107' : '#ddd', color: i < 2 ? '#fff' : '#666' }}>
                  {i+1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: '#333' }}>{dish.name}</p>
                  <div className="w-full mt-1 rounded-full h-1" style={{ background: '#f0f0f0' }}>
                    <div className="h-1 rounded-full" style={{ background: '#FF6B35', width: `${(dish.orders / stats.topDishes[0].orders) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#FF6B35' }}>×{dish.orders}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#f5f5f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Recent Orders</h3>
          <span className="text-xs" style={{ color: '#FF6B35', cursor: 'pointer' }}>View all -></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['Order ID', 'Table / Channel', 'Items', 'Amount', 'Status', 'Time'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#aaa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order, i) => (
                <tr key={i} className="transition-colors" style={{ borderBottom: '1px solid #f9f9f9' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-4 py-3 text-xs font-mono font-medium" style={{ color: '#FF6B35' }}>{order.id}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: '#333' }}>{order.table}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#666' }}>{order.items}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#1E1E1E' }}>₹{order.amount}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#aaa' }}>{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
