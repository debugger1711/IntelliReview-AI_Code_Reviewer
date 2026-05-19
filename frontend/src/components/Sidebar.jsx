import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlinePlusCircle,
  HiOutlineCollection,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineCode,
  HiOutlineLightningBolt
} from 'react-icons/hi';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/my-reviews', label: 'My Reviews', icon: HiOutlineCollection },
  { path: '/profile', label: 'Profile', icon: HiOutlineUser },
];

const Sidebar = () => {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#2e1065] text-white' // Deep purple active background
        : 'text-gray-400 hover:text-white hover:bg-[#1f2937]'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0b0f19] border-r border-[#1f2937]">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2">
          <HiOutlineCode className="text-[#a855f7] text-2xl" />
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">IntelliReview</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">AI Code Reviewer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={linkClass}
          >
            <item.icon className="text-lg flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center gap-3 w-[calc(100%-24px)] mx-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-[#1f2937] transition-colors mt-4 text-left"
        >
          <HiOutlineLogout className="text-lg" />
          <span>Logout</span>
        </button>
      </nav>


    </div>
  );

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 z-40">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
