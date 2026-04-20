import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@hotel.com', password: 'admin123', color: '#FF6B35' },
  { label: 'Staff', email: 'staff@hotel.com', password: 'staff123', color: '#28A745' },
  { label: 'Kitchen', email: 'kitchen@hotel.com', password: 'kitchen123', color: '#FFC107' },
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
      const res = await login(email, password);

      console.log("LOGIN SUCCESS:", res); // debug

      // 🔥 MAIN FIX (VERY IMPORTANT)
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0f0f' }}>

      {/* Right Panel Only (clean UI) */}
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '10px' }}>
            Welcome back
          </h2>

          {/* Demo buttons */}
          <div className="mb-6 flex gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.label}
                onClick={() => fillDemo(acc)}
                style={{
                  background: acc.color,
                  color: '#fff',
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none'
                }}
              >
                {acc.label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            />

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                background: '#FF6B35',
                color: '#fff',
                border: 'none'
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}