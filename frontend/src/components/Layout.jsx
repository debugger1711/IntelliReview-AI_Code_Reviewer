import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      <Sidebar isCollapsed={isSidebarCollapsed} toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          isSidebarCollapsed ? "lg:pl-[80px]" : "lg:pl-[260px]"
        )}
      >
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
