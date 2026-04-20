import React, { useState, useEffect } from 'react';
import { get, patch } from '../utils/api';

const KDS_STATUS = {
  pending:   { color: '#1a4a9c', bg: '#e8f0fe', label: 'New', next: 'preparing', nextLabel: 'Start Cooking' },
  confirmed: { color: '#1a4a9c', bg: '#e8f0fe', label: 'Confirmed', next: 'preparing', nextLabel: 'Start Cooking' },
  preparing: { color: '#8a6000', bg: '#fff8e1', label: 'Cooking', next: 'ready', nextLabel: 'Mark Ready' },
  ready:     { color: '#1a7a35', bg: '#e6f7ee', label: 'Ready', next: 'served', nextLabel: 'Serve' },
  served:    { color: '#555', bg: '#f0f0f0', label: 'Served', next: null },
};

function elapsed(date) {
  const mins = Math.floor((Date.now() - new Date(date)) / 60000);
  return mins < 1 ? 'Just now' : `${mins}m ago`;
}

export default function KDSPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('active');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => get('/orders').then(setOrders).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchOrders(); const i = setInterval(fetchOrders, 30000); return () => clearInterval(i); }, []);

  const updateStatus = async (id, status) => {
    try {
      const updated = await patch(`/orders/${id}/status`, { status });
      setOrders(o => o.map(x => x._id === updated._id ? updated : x));
    } catch {}
  };

  const activeOrders = orders.filter(o => ['pending','confirmed','preparing','ready'].includes(o.status));
  const completedOrders = orders.filter(o => ['served','billed'].includes(o.status));
  const displayed = filter === 'active' ? activeOrders : completedOrders;

  const channelColor = { 'dine-in': '#FF6B35', swiggy: '#FC8019', zomato: '#E23744', qr: '#28A745', takeaway: '#17a2b8' };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" /></div>;

  return (
    <div className="p-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button onClick={() => setFilter('active')} className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={filter === 'active' ? { background: '#FF6B35', color: '#fff' } : { background: '#f8f9fa', color: '#666' }}>
             Active ({activeOrders.length})
          </button>
          <button onClick={() => setFilter('done')} className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={filter === 'done' ? { background: '#28A745', color: '#fff' } : { background: '#f8f9fa', color: '#666' }}>
             Completed ({completedOrders.length})
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#aaa' }}>
          <span className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: '#28A745' }}></span>
          Auto-refresh every 30s
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'New Orders', value: orders.filter(o=>['pending','confirmed'].includes(o.status)).length, color: '#1a4a9c', bg: '#e8f0fe' },
          { label: 'In Kitchen', value: orders.filter(o=>o.status==='preparing').length, color: '#8a6000', bg: '#fff8e1' },
          { label: 'Ready to Serve', value: orders.filter(o=>o.status==='ready').length, color: '#1a7a35', bg: '#e6f7ee' },
          { label: 'Served Today', value: completedOrders.length, color: '#555', bg: '#f0f0f0' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3" style={{ background: s.bg }}>
            <p className="text-xs font-medium" style={{ color: s.color }}>{s.label}</p>
            <p className="text-2xl font-display font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Ticket Grid */}
      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4"></span>
          <p className="font-medium" style={{ color: '#666' }}>No {filter === 'active' ? 'active' : 'completed'} orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map(order => {
            const cfg = KDS_STATUS[order.status] || KDS_STATUS.pending;
            const mins = Math.floor((Date.now() - new Date(order.createdAt)) / 60000);
            const isUrgent = mins > 20 && order.status !== 'served';
            return (
              <div key={order._id} className="rounded-2xl overflow-hidden transition-all"
                style={{ border: `2px solid ${isUrgent ? '#DC3545' : cfg.color}33`, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {/* Ticket Header */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: cfg.bg }}>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm" style={{ color: '#1E1E1E' }}>{order.orderNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${cfg.color}22`, color: cfg.color }}>{cfg.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${channelColor[order.channel] || '#666'}22`, color: channelColor[order.channel] || '#666' }}>
                      {order.channel}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${isUrgent ? 'text-red-500' : ''}`}>{mins}m</p>
                    {order.tableNumber && <p className="text-xs" style={{ color: '#aaa' }}>T{order.tableNumber}</p>}
                  </div>
                </div>

                {/* Items */}
                <div className="px-4 py-3 space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: '#f5f5f5' }}>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#1E1E1E' }}>{item.quantity}</span>
                        <span className="text-sm" style={{ color: '#1E1E1E' }}>{item.name}</span>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: '#f8f9fa', color: '#666' }}>
                        {item.status || order.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer actions */}
                {cfg.next && (
                  <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: '#f5f5f5' }}>
                    <button onClick={() => updateStatus(order._id, cfg.next)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all btn-primary"
                      style={{ background: cfg.color, border: 'none', cursor: 'pointer' }}>
                      {cfg.nextLabel}
                    </button>
                    <button onClick={() => updateStatus(order._id, 'cancelled')}
                      className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ background: '#f8f9fa', color: '#aaa', border: '1px solid #eee', cursor: 'pointer' }}>
                      
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
