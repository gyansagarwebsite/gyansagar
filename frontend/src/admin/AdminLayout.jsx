import { Outlet } from 'react-router-dom';
import AdminHeader from './components/AdminHeader.jsx';
import AdminDrawer from './components/AdminDrawer.jsx';
import { useState } from 'react';
import './styles/admin.css';

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="admin-app">
      <AdminHeader onMenuToggle={() => setDrawerOpen(true)} />
      <AdminDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

