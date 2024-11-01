import React from 'react';
import Sidebar from './components/Sidebar/sidebar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="w-[100%] h-[100%] bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
