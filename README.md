# 🏨 HospitalityOS — Hotel Management System

A full-stack, production-ready Hotel & Restaurant Management System built with React.js, Node.js, Express, and MongoDB.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## Backend Setup

```bash
cd backend
npm install
# Edit .env to set your MONGO_URI if using Atlas
npm run dev        # Dev with nodemon
# or
npm start          # Production
```

Server runs on: `http://localhost:5000`

### Demo Login Credentials
| Role    | Email                | Password    |
|---------|----------------------|-------------|
| Admin   | admin@hotel.com      | admin123    |
| Staff   | staff@hotel.com      | staff123    |
| Kitchen | kitchen@hotel.com    | kitchen123  |

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on: `http://localhost:3000`

> If backend is on a different host, set `REACT_APP_API_URL=http://your-host:5000/api` in `frontend/.env`

---

## 🏗️ Project Structure

```
hotel-ms/
├── backend/
│   ├── server.js              # Express + Socket.io server
│   ├── .env                   # Environment variables
│   ├── models/
│   │   └── index.js           # All Mongoose models
│   ├── middleware/
│   │   └── auth.js            # JWT auth + role guard
│   └── routes/
│       ├── auth.js            # Login / Register
│       ├── dashboard.js       # Stats & analytics
│       ├── menu.js            # Menu items
│       ├── orders.js          # Order CRUD + status
│       ├── tables.js          # Table management
│       ├── inventory.js       # Stock tracking
│       ├── customers.js       # CRM data
│       └── delivery.js        # Delivery tracking
│
└── frontend/
    ├── public/
    │   └── index.html         # Tailwind CDN + fonts
    └── src/
        ├── App.js             # Root + layout shell
        ├── index.js           # React entry point
        ├── context/
        │   └── AuthContext.js # JWT auth state
        ├── utils/
        │   └── api.js         # Fetch wrapper
        ├── components/
        │   ├── Sidebar.js     # Navigation sidebar
        │   ├── Topbar.js      # Header + notifications
        │   └── UI.js          # Card, Badge, Button, etc.
        └── pages/
            ├── LoginPage.js   # Dark premium login
            ├── Dashboard.js   # Live KPIs + charts
            ├── POSPage.js     # Restaurant POS + billing
            ├── TablesPage.js  # Floor plan + status
            ├── KDSPage.js     # Kitchen display
            ├── InventoryPage.js # Stock management
            ├── CRMPage.js     # Customer loyalty
            └── OtherPages.js  # Delivery, QR, Reports, Analytics
```

---

## ✨ Features

### 🔐 Authentication
- JWT-based login/register
- Role-based access: Admin, Staff, Kitchen
- Protected routes per role

### 📊 Dashboard
- Live KPI cards (revenue, orders, occupancy, rating)
- Hourly revenue bar chart (Recharts)
- Order channel pie chart
- Weekly trend line chart
- Top dishes leaderboard
- Recent orders table

### 🧾 Restaurant POS
- Full menu grid with food images
- Category filter + search
- Live bill builder with GST calculation
- Multi-channel orders (Dine-in, Swiggy, Zomato, QR, Takeaway)
- Order lifecycle management
- Payment modal (UPI, Card, Cash)

### 🪑 Table Management
- Visual floor plan (15 tables)
- 4 statuses: Free, Occupied, Reserved, Cleaning
- Time-seated tracking with urgency alerts
- One-click status changes

### 👨‍🍳 Kitchen Display System
- Real-time order tickets
- Color-coded by status (New/Cooking/Ready)
- Auto-refresh every 30s
- Urgent order highlighting (>20min)
- Accept → Cooking → Ready → Serve flow

### 📦 Inventory
- Stock level bars with health indicators
- Critical/Low/OK/Good status
- One-click restock
- Reorder alerts banner

### 👥 CRM & Loyalty
- Customer profiles with tier badges
- Bronze → Silver → Gold → Platinum tiers
- Points balance + progress bar
- Visit history & spend tracking
- Send loyalty offers

### 🛵 Delivery
- Swiggy + Zomato order tracking
- Live map visual
- Rider assignment + ETA
- Status progression

### 📱 QR Ordering
- Per-table QR code display
- Scan statistics
- PDF download

### 📋 Reports + Analytics
- P&L summary
- Channel-wise sales charts
- Branch performance comparison

---

## 🔄 Real-Time (Socket.io)

The backend emits events on order/table changes:
- `order:update` — new order or status change
- `table:refresh` — table status change

Frontend can subscribe with:
```js
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.on('order:update', (order) => { /* update state */ });
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#FF6B35` |
| Secondary | `#1E1E1E` |
| Background | `#F8F9FA` |
| Success | `#28A745` |
| Warning | `#FFC107` |
| Error | `#DC3545` |
| Font (body) | Inter |
| Font (headings) | Poppins |
| Border radius | 12px |

---

## 🔗 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/register` | Register user |
| GET | `/api/dashboard/stats` | Live dashboard data |
| GET | `/api/menu` | All menu items |
| GET | `/api/orders` | All orders |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/:id/status` | Update order status |
| PATCH | `/api/orders/:id/payment` | Process payment |
| GET | `/api/tables` | All tables |
| PATCH | `/api/tables/:id` | Update table |
| GET | `/api/inventory` | Stock items |
| POST | `/api/inventory/:id/restock` | Restock item |
| GET | `/api/customers` | CRM customers |
| GET | `/api/delivery` | Delivery orders |

---

## 🚢 Deployment

### Backend (Railway / Render)
```bash
# Set environment variables:
MONGO_URI=your_atlas_uri
JWT_SECRET=your_secret
PORT=5000
```

### Frontend (Vercel / Netlify)
```bash
REACT_APP_API_URL=https://your-backend.railway.app/api
npm run build
# Deploy the /build folder
```
