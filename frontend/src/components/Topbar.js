import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  analytics: 'BI Analytics',
  pos: 'Restaurant POS',
  tables: 'Table Management',
  kds: 'Kitchen Display',
  inventory: 'Inventory',
  delivery: 'Delivery Hub',
  crm: 'CRM & Loyalty',
  qr: 'QR Ordering',
  reports: 'Reports',
};

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const NOTIF_ICONS = {
  warning: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  order: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  truck: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
};

export default function Topbar({ active }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const now = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  const notifications = [
    { icon: 'warning', text: 'Low stock: Basmati Rice (8kg)', time: '2m ago', color: '#FFC107' },
    { icon: 'order',   text: 'New Zomato order #ZO-3201',     time: '5m ago', color: '#FF6B35' },
    { icon: 'check',   text: 'Table 7 bill paid — Rs. 609',   time: '12m ago', color: '#28A745' },
    { icon: 'truck',   text: 'Rider Ravi on the way — 8 min', time: '18m ago', color: '#17a2b8' },
  ];

  return (
    <header className="flex items-center gap-4 px-6 h-14 flex-shrink-0 relative z-20"
      style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1E1E1E', letterSpacing: '0.01em' }}>
          {PAGE_TITLES[active] || 'Dashboard'}
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#bbb', marginTop: '1px' }}>{now}</p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: '#e6f7ee' }}>
          <span className="pulse-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#28A745' }}></span>
          <span style={{ color: '#1a7a35', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700 }}>Live</span>
        </div>

        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)}
            className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all"
            style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#666' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f8f9fa'}>
            <BellIcon />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#DC3545', border: '1.5px solid white' }}></span>
          </button>
          {showNotif && (
            <div className="absolute right-0 top-11 w-80 rounded-2xl shadow-xl z-50 overflow-hidden fade-in"
              style={{ background: '#fff', border: '1px solid #f0f0f0' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#f0f0f0' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: '#1E1E1E' }}>Notifications</span>
                <span style={{ background: '#fff3ef', color: '#FF6B35', fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>4 new</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3 cursor-pointer transition-all"
                  style={{ borderBottom: i < notifications.length-1 ? '1px solid #f9f9f9' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: n.color + '22', color: n.color }}>
                    {NOTIF_ICONS[n.icon]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: '#333', fontWeight: 500 }}>{n.text}</p>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: '#aaa', marginTop: '2px' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ background: '#FF6B35', fontSize: '12px', fontFamily: 'Syne, sans-serif' }}>
            {initials}
          </div>
          <div className="hidden sm:block">
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 700, color: '#1E1E1E' }}>{user?.name}</p>
            <p className="capitalize" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: '#FF6B35' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
