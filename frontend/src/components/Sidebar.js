import React from 'react';
import { useAuth } from '../context/AuthContext';

const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    analytics: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
    pos: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    tables: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/></>,
    kds: <><path d="M6 2v8"/><path d="M18 2v8"/><path d="M2 12h20"/><path d="M8 20h8"/><path d="M12 15v5"/></>,
    inventory: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>,
    delivery: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    crm: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    qr: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M17 17h3v3h-3z"/><path d="M14 20h3"/><path d="M20 14v3"/></>,
    reports: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    logo: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const NAV = [
  { section: 'Overview', items: [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', icon: 'analytics', label: 'Analytics', adminOnly: true },
  ]},
  { section: 'Operations', items: [
    { id: 'pos', icon: 'pos', label: 'POS & Orders' },
    { id: 'tables', icon: 'tables', label: 'Tables' },
    { id: 'kds', icon: 'kds', label: 'Kitchen Display', badge: 5 },
    { id: 'inventory', icon: 'inventory', label: 'Inventory', adminOnly: true },
    { id: 'delivery', icon: 'delivery', label: 'Delivery' },
  ]},
  { section: 'Guests', items: [
    { id: 'crm', icon: 'crm', label: 'CRM & Loyalty', adminOnly: true },
    { id: 'qr', icon: 'qr', label: 'QR Ordering' },
  ]},
  { section: 'Finance', items: [
    { id: 'reports', icon: 'reports', label: 'Reports', adminOnly: true },
  ]},
];

export default function Sidebar({ active, setActive }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <aside className="flex flex-col h-screen w-56 flex-shrink-0" style={{ background: '#1E1E1E' }}>
      <div className="px-4 py-5 border-b" style={{ borderColor: '#2a2a2a' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FF6B35', color: '#fff' }}>
            <Icon name="logo" size={18} />
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.03em' }}>HospitalityOS</div>
            <div style={{ color: '#555', fontFamily: 'DM Sans, sans-serif', fontSize: '11px' }}>v3.0 Pro</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV.map(group => (
          <div key={group.section} className="mb-5">
            <div className="px-3 pb-2" style={{ color: '#3a3a3a', fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {group.section}
            </div>
            {group.items.filter(i => !i.adminOnly || isAdmin).map(item => (
              <button key={item.id} onClick={() => setActive(item.id)}
                className="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all"
                style={active === item.id
                  ? { background: '#FF6B35', color: '#fff' }
                  : { background: 'transparent', color: '#666' }}>
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <Icon name={item.icon} />
                </span>
                <span style={{ flex: 1, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background: '#DC3545', color: 'white', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '20px' }}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: '#2a2a2a' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: '#FF6B35', fontSize: '12px', fontFamily: 'Syne, sans-serif' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700 }}>{user?.name}</div>
            <div className="capitalize" style={{ color: '#FF6B35', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600 }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={logout}
          className="w-full py-2 rounded-xl transition-all flex items-center justify-center gap-2"
          style={{ background: '#2a2a2a', color: '#666', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = '#666'; }}>
          <Icon name="logout" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
