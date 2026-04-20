// src/utils/api.js

// Base URL from Vite env
const BASE = import.meta.env.VITE_API_URL;

// Generic API handler
export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('hms_token');

  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });

    // Safe JSON parsing (important 🔥)
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;

  } catch (err) {
    // Network / CORS / server down
    throw new Error(err.message || 'Network error');
  }
};

// Helper methods
export const get = (url) => api(url);

export const post = (url, body) =>
  api(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const patch = (url, body) =>
  api(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const del = (url) =>
  api(url, {
    method: 'DELETE',
  });