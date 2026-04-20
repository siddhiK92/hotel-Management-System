import React, { useState, useEffect } from 'react';
import { Card, StatCard, Badge, Button } from '../components/UI';
import { get, patch } from '../utils/api';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restocking, setRestocking] = useState(null);

  useEffect(() => { get('/inventory').then(setItems).finally(() => setLoading(false)); }, []);

  const getHealth = (item) => {
    const pct = (item.currentStock / item.maxStock) * 100;
    if (item.currentStock <= item.reorderLevel * 0.5) return { label: 'Critical', color: '#DC3545', bg: '#fdecea', pct };
    if (item.currentStock <= item.reorderLevel) return { label: 'Low', color: '#FFC107', bg: '#fff8e1', pct };
    if (pct > 70) return { label: 'Good', color: '#28A745', bg: '#e6f7ee', pct };
    return { label: 'OK', color: '#17a2b8', bg: '#e0f7fa', pct };
  };

  const restock = async (item) => {
    setRestocking(item._id);
    try {
      const updated = await patch(`/inventory/${item._id}/restock`, { quantity: item.maxStock - item.currentStock });
      setItems(i => i.map(x => x._id === updated._id ? updated : x));
    } catch { alert('Restock failed'); } finally { setRestocking(null); }
  };

  const lowStock = items.filter(i => i.currentStock <= i.reorderLevel);
  const critical = items.filter(i => i.currentStock <= i.reorderLevel * 0.5);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" /></div>;

  return (
    <div className="p-6 fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Items" value={items.length} icon="box" accentColor="#FF6B35" />
        <StatCard label="Low Stock" value={lowStock.length} sub="Need reorder" icon="warning" accentColor="#FFC107" />
        <StatCard label="Critical" value={critical.length} sub="Order immediately" icon="alert" accentColor="#DC3545" />
        <StatCard label="Healthy" value={items.length - lowStock.length} sub="Well stocked" icon="check" accentColor="#28A745" />
      </div>

      {critical.length > 0 && (
        <div className="rounded-xl p-4 mb-4 flex items-start gap-3" style={{ background: '#fdecea', border: '1px solid #f5c6c6' }}>
          <span className="text-xl"></span>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#b02020' }}>Critical Stock Alert</p>
            <p className="text-xs mt-1" style={{ color: '#c53030' }}>
              {critical.map(i => i.name).join(', ')} need immediate restocking.
            </p>
          </div>
        </div>
      )}

      <Card>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#f5f5f5' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Inventory Status</h3>
          <Button size="sm" onClick={() => alert('Export feature: generates CSV report')}>Export CSV</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['Item', 'Category', 'Stock', 'Reorder Level', 'Health', 'Supplier', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#aaa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const health = getHealth(item);
                const pctBar = Math.min(100, Math.max(0, health.pct));
                return (
                  <tr key={item._id} className="transition-colors" style={{ borderBottom: '1px solid #f9f9f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-4 py-3 font-medium text-sm" style={{ color: '#1E1E1E' }}>{item.name}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#666' }}>{item.category}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>{item.currentStock} {item.unit}</span>
                      <span className="text-xs ml-1" style={{ color: '#aaa' }}>/ {item.maxStock}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#666' }}>{item.reorderLevel} {item.unit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full" style={{ background: '#f0f0f0' }}>
                          <div className="h-full rounded-full" style={{ width: `${pctBar}%`, background: health.color }} />
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: health.bg, color: health.color }}>
                          {health.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#666' }}>{item.supplier}</td>
                    <td className="px-4 py-3">
                      {item.currentStock <= item.reorderLevel && (
                        <Button size="sm" disabled={restocking === item._id} onClick={() => restock(item)}>
                          {restocking === item._id ? '...' : 'Restock'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
