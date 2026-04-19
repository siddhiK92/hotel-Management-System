import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@hotel.com', password: 'admin123', color: '#FF6B35', desc: 'Full access to all features' },
  { label: 'Staff', email: 'staff@hotel.com', password: 'staff123', color: '#28A745', desc: 'POS, tables, orders' },
  { label: 'Kitchen', email: 'kitchen@hotel.com', password: 'kitchen123', color: '#FFC107', desc: 'KDS, order status' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@hotel.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => { setEmail(acc.email); setPassword(acc.password); };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0f0f' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0e 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #FF6B35 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff9966 0%, transparent 50%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FF6B35', color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '14px' }}>HMS</div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#fff' }}>HospitalityOS</div>
              <div className="text-gray-500 text-xs">Restaurant Management Suite</div>
            </div>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
            Manage your<br />
            <span style={{ color: '#FF6B35' }}>restaurant smarter.</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Complete POS, kitchen display, inventory tracking, loyalty management, and analytics — all in one platform.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[['POS', 'Smart POS'],['KDS', 'Kitchen Display'],['BI', 'Live Analytics'],['DEL', 'Delivery Hub']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-gray-400 text-sm">
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '10px', background: '#FF6B35', color: '#fff', borderRadius: '6px', padding: '2px 5px', minWidth: '28px', textAlign: 'center' }}>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" alt="Restaurant" className="rounded-2xl opacity-30 w-full object-cover" style={{ height: '200px' }} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', color: '#fff', marginBottom: '4px' }}>Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your workspace</p>
          </div>

          {/* Demo Quick Login */}
          <div className="mb-6">
            <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">Quick Login</p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.label} onClick={() => fillDemo(acc)}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all hover:scale-105"
                  style={{ background: `${acc.color}22`, color: acc.color, border: `1px solid ${acc.color}44` }}>
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-400 border border-red-900" style={{ background: '#1a0000' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all"
                style={{ background: '#1a1a1a', border: '1px solid #333', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#333'}
                placeholder="you@restaurant.com" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-white text-sm"
                style={{ background: '#1a1a1a', border: '1px solid #333', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#FF6B35'}
                onBlur={e => e.target.style.borderColor = '#333'}
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 rounded-xl font-semibold text-white text-sm mt-2"
              style={{ background: loading ? '#666' : '#FF6B35', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <p className="text-gray-500 text-xs mb-2">Demo credentials:</p>
            {DEMO_ACCOUNTS.map(a => (
              <div key={a.email} className="text-xs text-gray-500 flex justify-between">
                <span style={{ color: a.color }}>{a.label}</span>
                <span>{a.email} / {a.password}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
