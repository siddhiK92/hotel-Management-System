// src/utils/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('hms_token');

  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Request failed');

  return data;
};

export const get = (url) => api(url);
export const post = (url, body) =>
  api(url, { method: 'POST', body: JSON.stringify(body) });
export const patch = (url, body) =>
  api(url, { method: 'PATCH', body: JSON.stringify(body) });
export const del = (url) =>
  api(url, { method: 'DELETE' });