import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  User,
  LogOut,
  Code2
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/new-review', label: 'New Review', icon: PlusCircle },
  { path: '/my-reviews', label: 'My Reviews', icon: FolderKanban },
  { path: '/profile', label: 'Profile', icon: User },
];

const Sidebar = () => {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 mx-3 rounded-lg text-sm font-medium transition-all group relative",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-text-secondary hover:text-text-primary hover:bg-surface"
    );

  const SidebarContent = () => (
    <div className="flex h-full w-[260px] flex-col border-r border-border bg-background transition-colors">
      {/* Logo Area */}
      <div className="flex h-[72px] items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-text-primary leading-tight">
              IntelliReview
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
              AI Reviewer
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={linkClass}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-error/10 hover:text-error"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-[260px] lg:flex-col">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
