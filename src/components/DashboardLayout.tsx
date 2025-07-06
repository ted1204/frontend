// src/components/DashboardLayout.tsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const sidebarStyle: React.CSSProperties = {
  width: '220px',
  background: '#222',
  color: '#fff',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  padding: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const contentStyle: React.CSSProperties = {
  marginLeft: '220px',
  padding: '2rem',
  minHeight: '100vh',
  background: '#292929',
  color: '#fff',
  borderRadius: '12px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
  marginTop: '2rem',
  marginRight: '2rem',
  maxWidth: '900px',
};

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav style={sidebarStyle}>
        <div style={{ padding: '0 1rem', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          AI platform
        </div>
        <Link to="/notebooks" style={{ color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
          數據面板
        </Link>
        <Link to="/ros2" style={{ color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
          ROS2 控制面板
        </Link>
        <Link to="/profile" style={{ color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem' }}>
          帳戶資料
        </Link>
        <button onClick={handleLogout} style={{ color: '#fff', background: 'none', border: 'none', textAlign: 'left', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          登出
        </button>
      </nav>
      <main style={contentStyle}>
        <Outlet />
      </main>
    </div>
  );
}
