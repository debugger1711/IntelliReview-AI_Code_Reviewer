import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { HiOutlineSun, HiChevronDown } from 'react-icons/hi';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Simple mapping to give the page a title based on route
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Dashboard', subtitle: 'Review your code with AI and improve your skills' };
      case '/new-review':
        return { title: 'New Review', subtitle: 'Submit new code for AI analysis' };
      case '/my-reviews':
        return { title: 'My Reviews', subtitle: 'Browse and manage your past code reviews' };
      case '/profile':
        return { title: 'Profile', subtitle: 'Manage your account settings' };
      default:
        return { title: 'Dashboard', subtitle: 'Review your code with AI and improve your skills' };
    }
  };

  const { title, subtitle } = getPageInfo();

  // Derive initials for avatar (e.g. "Aditya" -> "AD")
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-dark-900)' }}>
      <Sidebar />
      <main className="dashboard-main min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="px-8 pt-8 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">

            {/* User Profile Dropdown Placeholder */}
            <div className="flex items-center gap-3 bg-[#111827] border border-[#1f2937] rounded-full py-1.5 px-2 pr-4 cursor-pointer hover:bg-[#1f2937] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#6d28d9] flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user?.name)}
              </div>
              <span className="text-sm font-medium text-white">{user?.name?.split(' ')[0] || 'User'}</span>
              <HiChevronDown className="text-gray-400 text-sm ml-1" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 pt-4 w-full flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
