import React, { useState, useEffect } from 'react';
import { Card, StatCard, Badge } from '../components/UI';
import { get, patch } from '../utils/api';

const STATUS_CONFIG = {
  free:     { color: '#28A745', bg: '#e6f7ee', border: '#28A745', label: 'Free', icon: '' },
  occupied: { color: '#FF6B35', bg: '#fff3ef', border: '#FF6B35', label: 'Occupied', icon: '' },
  reserved: { color: '#FFC107', bg: '#fff8e1', border: '#FFC107', label: 'Reserved', icon: '' },
  cleaning: { color: '#DC3545', bg: '#fdecea', border: '#DC3545', label: 'Cleaning', icon: '' },
};

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { get('/tables').then(setTables).finally(() => setLoading(false)); }, []);

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => ({ ...acc, [s]: tables.filter(t => t.status === s).length }), {});

  const updateStatus = async (id, status) => {
    try {
      const updated = await patch(`/tables/${id}`, { status });
      setTables(t => t.map(x => x._id === updated._id ? updated : x));
      setSelected(s => s?._id === id ? updated : s);
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" /></div>;

  return (
    <div className="p-6 fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Occupied" value={counts.occupied} sub={`${Math.round((counts.occupied||0)/tables.length*100)}% occupancy`} icon="" accentColor="#FF6B35" />
        <StatCard label="Free" value={counts.free} sub="Available now" icon="" accentColor="#28A745" />
        <StatCard label="Reserved" value={counts.reserved} sub="Upcoming" icon="" accentColor="#FFC107" />
        <StatCard label="Cleaning" value={counts.cleaning} sub="In progress" icon="" accentColor="#DC3545" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
          <div key={s} className="flex items-center gap-2 text-xs" style={{ color: '#666' }}>
            <div className="w-3 h-3 rounded" style={{ background: cfg.bg, border: `2px solid ${cfg.color}` }} />
            {cfg.label}
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Floor Plan Grid */}
        <div className="flex-1">
          <Card>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#f5f5f5' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Restaurant Floor Plan</h3>
              <span className="text-xs" style={{ color: '#aaa' }}>{tables.length} tables total</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-3">
                {tables.map(table => {
                  const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.free;
                  const isSelected = selected?._id === table._id;
                  return (
                    <div key={table._id} onClick={() => setSelected(isSelected ? null : table)}
                      className="table-tile rounded-xl p-3 text-center"
                      style={{
                        background: cfg.bg,
                        border: `2px solid ${isSelected ? '#1E1E1E' : cfg.border}`,
                        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                      }}>
                      <div className="text-base mb-1">{cfg.icon}</div>
                      <div className="text-base font-display font-bold" style={{ color: '#1E1E1E' }}>T{table.number}</div>
                      <div className="text-xs mt-0.5" style={{ color: cfg.color }}>{cfg.label}</div>
                      {table.status === 'occupied' && table.minutesOccupied > 0 && (
                        <div className="text-xs mt-1" style={{ color: '#aaa' }}>{table.minutesOccupied}m</div>
                      )}
                      {table.status === 'occupied' && table.currentPax > 0 && (
                        <div className="text-xs" style={{ color: '#666' }}>{table.currentPax}/{table.capacity} </div>
                      )}
                      {table.reservedBy && (
                        <div className="text-xs mt-0.5 truncate" style={{ color: '#888' }}>{table.reservedBy}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Table Detail Panel */}
        {selected && (
          <div className="w-64 flex-shrink-0 fade-in">
            <Card>
              <div className="p-4 border-b" style={{ borderColor: '#f5f5f5', background: STATUS_CONFIG[selected.status]?.bg }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#1E1E1E' }} style={{ color: '#1E1E1E' }}>Table {selected.number}</h3>
                    <p className="text-xs mt-0.5" style={{ color: STATUS_CONFIG[selected.status]?.color }}>
                      {STATUS_CONFIG[selected.status]?.label}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg"></button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#666' }}>Capacity</span>
                  <span className="font-medium" style={{ color: '#1E1E1E' }}>{selected.capacity} pax</span>
                </div>
                {selected.currentPax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#666' }}>Current pax</span>
                    <span className="font-medium" style={{ color: '#1E1E1E' }}>{selected.currentPax}</span>
                  </div>
                )}
                {selected.minutesOccupied > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#666' }}>Time seated</span>
                    <span className="font-medium" style={{ color: selected.minutesOccupied > 60 ? '#DC3545' : '#1E1E1E' }}>
                      {selected.minutesOccupied}m {selected.minutesOccupied > 60 ? '' : ''}
                    </span>
                  </div>
                )}
                {selected.reservedBy && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#666' }}>Reserved by</span>
                    <span className="font-medium text-xs" style={{ color: '#1E1E1E' }}>{selected.reservedBy}</span>
                  </div>
                )}

                <div className="border-t pt-3" style={{ borderColor: '#f0f0f0' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: '#666' }}>Change Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
                      <button key={s} onClick={() => updateStatus(selected._id, s)}
                        disabled={selected.status === s}
                        className="py-2 rounded-xl text-xs font-medium transition-all"
                        style={selected.status === s
                          ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}`, cursor: 'not-allowed' }
                          : { background: '#f8f9fa', color: '#666', border: '1px solid #eee', cursor: 'pointer' }}>
                        {cfg.icon} {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
