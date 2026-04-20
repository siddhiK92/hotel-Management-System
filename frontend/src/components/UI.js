import React from 'react';

// SVG icon set — no emojis
const ICONS = {
  revenue: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  orders: <><path d="M3 2h1l.4 2M7 13h10l4-8H5.4M7 13L5.4 4M7 13l-2 5h12M9 20a1 1 0 1 0 2 0 1 1 0 0 0-2 0M16 20a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/></>,
  tables: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="15" y1="9" x2="15" y2="21"/></>,
  rating: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  trend: <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>,
  check: <polyline points="20 6 9 17 4 12"/>,
  kitchen: <><path d="M6 2v8"/><path d="M18 2v8"/><path d="M2 12h20"/><path d="M8 20h8"/><path d="M12 15v5"/></>,
  box: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>,
  warning: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  gold: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
  mobile: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
  truck: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  repeat: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
};

const StatIcon = ({ name }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {ICONS[name] || ICONS.trend}
  </svg>
);

export const Card = ({ children, className = '', style = {}, onClick }) => (
  <div onClick={onClick}
    className={`rounded-xl ${onClick ? 'card-hover cursor-pointer' : ''} ${className}`}
    style={{ background: '#fff', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', ...style }}>
    {children}
  </div>
);

export const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    green:  { bg: '#e6f7ee', text: '#1a7a35' },
    orange: { bg: '#fff3ef', text: '#FF6B35' },
    yellow: { bg: '#fff8e1', text: '#8a6000' },
    red:    { bg: '#fdecea', text: '#b02020' },
    blue:   { bg: '#e8f0fe', text: '#1a4a9c' },
    gray:   { bg: '#f0f0f0', text: '#555' },
    purple: { bg: '#f3e8ff', text: '#6b21a8' },
  };
  const c = colors[color] || colors.gray;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text, fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700 }}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    served: 'green', billed: 'blue', paid: 'green', pending: 'yellow',
    preparing: 'orange', ready: 'purple', cancelled: 'red', free: 'green',
    occupied: 'orange', reserved: 'yellow', cleaning: 'red', 'on-way': 'green',
    'picked-up': 'blue', 'in-kitchen': 'yellow', delivered: 'green', confirmed: 'blue',
  };
  return <Badge color={map[status] || 'gray'}>{status?.replace('-', ' ')}</Badge>;
};

export const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', type = 'button' }) => {
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '8px 16px', fontSize: '13px' },
    lg: { padding: '12px 24px', fontSize: '15px' },
  };
  const variants = {
    primary: { background: disabled ? '#ccc' : '#FF6B35', color: '#fff', border: 'none' },
    outline:  { background: 'transparent', color: '#FF6B35', border: '1px solid #FF6B35' },
    ghost:    { background: 'transparent', color: '#666', border: '1px solid #eee' },
    danger:   { background: '#DC3545', color: '#fff', border: 'none' },
    success:  { background: '#28A745', color: '#fff', border: 'none' },
  };
  const sz = sizes[size] || sizes.md;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`btn-primary rounded-xl transition-all ${className}`}
      style={{ ...variants[variant], ...sz, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, letterSpacing: '0.01em' }}>
      {children}
    </button>
  );
};

export const StatCard = ({ label, value, sub, trend, icon, accentColor = '#FF6B35' }) => (
  <Card>
    <div className="p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: accentColor }} />
      <div className="flex items-start justify-between mb-3">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        {icon && (
          <span className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: accentColor + '15', color: accentColor }}>
            <StatIcon name={icon} />
          </span>
        )}
      </div>
      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', color: '#1E1E1E', lineHeight: 1 }}>{value}</p>
      {(sub || trend !== undefined) && (
        <div className="flex items-center gap-2 mt-2">
          {trend !== undefined && (
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px',
              background: trend > 0 ? '#e6f7ee' : '#fdecea', color: trend > 0 ? '#1a7a35' : '#b02020' }}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {sub && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#aaa' }}>{sub}</span>}
        </div>
      )}
    </div>
  </Card>
);

export const Input = ({ label, value, onChange, placeholder, type = 'text', className = '' }) => (
  <div className={className}>
    {label && <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full transition-all"
      style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1E1E1E', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
      onFocus={e => { e.target.style.borderColor = '#FF6B35'; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = '#eee'; e.target.style.background = '#f8f9fa'; }} />
  </div>
);

export const Select = ({ label, value, onChange, options, className = '' }) => (
  <div className={className}>
    {label && <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>{label}</label>}
    <select value={value} onChange={onChange}
      style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1E1E1E', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontFamily: 'DM Sans, sans-serif', outline: 'none', width: '100%' }}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  </div>
);

export const Spinner = () => (
  <div className="flex items-center justify-center h-32">
    <div className="w-8 h-8 rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" />
  </div>
);

export const EmptyState = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {icon && <span className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: '#f8f9fa', color: '#ccc' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{ICONS[icon] || ICONS.box}</svg>
    </span>}
    <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#333', marginBottom: '4px' }}>{title}</p>
    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', color: '#aaa' }}>{desc}</p>
  </div>
);
