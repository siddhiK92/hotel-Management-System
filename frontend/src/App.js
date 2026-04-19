import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import POSPage from './pages/POSPage';
import TablesPage from './pages/TablesPage';
import KDSPage from './pages/KDSPage';
import InventoryPage from './pages/InventoryPage';
import CRMPage from './pages/CRMPage';
import { DeliveryPage, QRPage, ReportsPage, AnalyticsPage } from './pages/OtherPages';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const PAGES = {
  dashboard: Dashboard,
  pos: POSPage,
  tables: TablesPage,
  kds: KDSPage,
  inventory: InventoryPage,
  delivery: DeliveryPage,
  crm: CRMPage,
  qr: QRPage,
  reports: ReportsPage,
  analytics: AnalyticsPage,
};

function AppShell() {
  const { user, loading } = useAuth();
  const [active, setActive] = useState('dashboard');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f0f' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: '#FF6B35' }}>HMS</div>
        <div className="w-8 h-8 mx-auto rounded-full border-2 border-orange-200 border-t-orange-500 animate-spin" />
      </div>
    </div>
  );

  if (!user) return <LoginPage />;

  // Role-based landing page
  const defaultPage = user.role === 'kitchen' ? 'kds' : user.role === 'staff' ? 'pos' : 'dashboard';
  const currentPage = active in PAGES ? active : defaultPage;
  const PageComponent = PAGES[currentPage] || Dashboard;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8F9FA' }}>
      <Sidebar active={currentPage} setActive={setActive} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar active={currentPage} />
        <main className="flex-1 overflow-y-auto">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
