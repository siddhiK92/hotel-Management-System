import React, { useState, useEffect } from 'react';
import { Card, StatCard, Badge } from '../components/UI';
import { get } from '../utils/api';

const TIER_CONFIG = {
  bronze:   { color: '#a0522d', bg: '#fdf5ec', icon: '', minPts: 0, nextPts: 1000 },
  silver:   { color: '#607d8b', bg: '#f5f8fa', icon: '', minPts: 1000, nextPts: 3000 },
  gold:     { color: '#f9a825', bg: '#fffde7', icon: '', minPts: 3000, nextPts: 6000 },
  platinum: { color: '#5c6bc0', bg: '#f3e8ff', icon: '', minPts: 6000, nextPts: null },
};

function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / (1000 * 60 * 60));
  if (diff < 24) return diff < 1 ? 'Today' : `${diff}h ago`;
  const days = Math.floor(diff / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

export default function CRMPage() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { get('/customers').then(c => { setCustomers(c); setSelected(c[0]); }).finally(() => setLoading(false)); }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const tierCounts = Object.keys(TIER_CONFIG).reduce((acc, t) => ({ ...acc, [t]: customers.filter(c => c.tier === t).length }), {});

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" /></div>;

  return (
    <div className="p-6 fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Members" value={customers.length.toLocaleString()} icon="users" accentColor="#FF6B35" />
        <StatCard label="Platinum" value={tierCounts.platinum} sub="Top customers" icon="star" accentColor="#5c6bc0" />
        <StatCard label="Gold" value={tierCounts.gold} sub="Loyal regulars" icon="gold" accentColor="#f9a825" />
        <StatCard label="Points Issued" value="2.4M" sub="This month" icon="rating" accentColor="#28A745" />
      </div>

      {/* Tier Breakdown */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {Object.entries(TIER_CONFIG).map(([tier, cfg]) => (
          <div key={tier} className="rounded-xl p-4" style={{ background: cfg.bg, border: `1px solid ${cfg.color}33` }}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{cfg.icon}</span>
              <span className="text-2xl font-display font-bold" style={{ color: cfg.color }}>{tierCounts[tier]}</span>
            </div>
            <p className="text-xs font-medium capitalize mt-2" style={{ color: cfg.color }}>{tier}</p>
            <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{cfg.minPts.toLocaleString()}+ pts</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Customer List */}
        <div className="flex-1">
          <Card>
            <div className="p-4 border-b" style={{ borderColor: '#f5f5f5' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or phone..."
                className="w-full px-3 py-2 rounded-xl text-sm"
                style={{ background: '#f8f9fa', border: '1px solid #eee', outline: 'none', color: '#333' }} />
            </div>
            <div className="divide-y" style={{ borderColor: '#f9f9f9' }}>
              {filtered.map(c => {
                const cfg = TIER_CONFIG[c.tier] || TIER_CONFIG.bronze;
                const isSelected = selected?._id === c._id;
                return (
                  <div key={c._id} onClick={() => setSelected(c)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                    style={{ background: isSelected ? '#fff3ef' : 'transparent', borderLeft: isSelected ? '3px solid #FF6B35' : '3px solid transparent' }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#fafafa'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: cfg.color }}>
                      {c.name.slice(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate" style={{ color: '#1E1E1E' }}>{c.name}</p>
                        <span className="text-base">{cfg.icon}</span>
                      </div>
                      <p className="text-xs truncate" style={{ color: '#aaa' }}>{c.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold" style={{ color: '#FF6B35' }}>{c.loyaltyPoints.toLocaleString()} pts</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{c.visitCount} visits</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Customer Detail */}
        {selected && (
          <div className="w-72 flex-shrink-0 fade-in">
            <Card>
              {/* Profile header */}
              <div className="p-5" style={{ background: TIER_CONFIG[selected.tier]?.bg }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: TIER_CONFIG[selected.tier]?.color }}>
                    {selected.name.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold" style={{ color: '#1E1E1E' }}>{selected.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-base">{TIER_CONFIG[selected.tier]?.icon}</span>
                      <span className="text-xs capitalize font-semibold" style={{ color: TIER_CONFIG[selected.tier]?.color }}>{selected.tier} Member</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {[
                  ['', 'Email', selected.email],
                  ['', 'Phone', selected.phone],
                  ['', 'Last Visit', timeAgo(selected.lastVisit)],
                  ['', 'Total Visits', selected.visitCount],
                  ['', 'Total Spent', `₹${selected.totalSpent?.toLocaleString()}`],
                ].map(([icon, label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span style={{ color: '#888' }}>{icon} {label}</span>
                    <span className="font-medium text-xs text-right" style={{ color: '#1E1E1E', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                  </div>
                ))}

                {/* Loyalty Points */}
                <div className="border-t pt-3" style={{ borderColor: '#f0f0f0' }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs" style={{ color: '#666' }}>Loyalty Points</span>
                    <span className="text-sm font-bold" style={{ color: '#FF6B35' }}>{selected.loyaltyPoints.toLocaleString()}</span>
                  </div>
                  {TIER_CONFIG[selected.tier]?.nextPts && (
                    <>
                      <div className="w-full h-2 rounded-full" style={{ background: '#f0f0f0' }}>
                        <div className="h-full rounded-full transition-all" style={{
                          background: TIER_CONFIG[selected.tier]?.color,
                          width: `${Math.min(100, (selected.loyaltyPoints / TIER_CONFIG[selected.tier]?.nextPts) * 100)}%`
                        }} />
                      </div>
                      <p className="text-xs mt-1" style={{ color: '#aaa' }}>
                        {(TIER_CONFIG[selected.tier]?.nextPts - selected.loyaltyPoints).toLocaleString()} pts to next tier
                      </p>
                    </>
                  )}
                </div>

                <button className="w-full py-2 rounded-xl text-xs font-medium text-white btn-primary"
                  style={{ background: '#FF6B35', border: 'none', cursor: 'pointer' }}
                  onClick={() => alert(`Sending offer to ${selected.name}`)}>
                   Send Loyalty Offer
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
