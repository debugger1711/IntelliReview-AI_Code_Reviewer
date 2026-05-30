import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Overview', subtitle: 'Welcome back, track your code review metrics' };
      case '/new-review':
        return { title: 'New Review', subtitle: 'Submit code for AI-powered analysis' };
      case '/my-reviews':
        return { title: 'My Reviews', subtitle: 'Browse and manage your past code reviews' };
      case '/profile':
        return { title: 'Profile', subtitle: 'Manage your account settings and preferences' };
      default:
        return { title: 'Dashboard', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-[260px] transition-all">
        <TopNav title={title} subtitle={subtitle} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
