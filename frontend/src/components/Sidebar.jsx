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
  Code2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/new-review', label: 'New Review', icon: PlusCircle },
  { path: '/my-reviews', label: 'My Reviews', icon: FolderKanban },
  { path: '/profile', label: 'Profile', icon: User },
];

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-3 py-2 mx-3 rounded-lg text-sm font-medium transition-all group relative",
      isCollapsed ? "px-0 justify-center" : "px-3",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-text-secondary hover:text-text-primary hover:bg-surface"
    );

  const SidebarContent = () => (
    <div 
      className={cn(
        "flex h-full flex-col border-r border-border bg-background transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Logo Area */}
      <div className={cn("flex h-[72px] items-center border-b border-border/50", isCollapsed ? "justify-center px-0" : "px-6")}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col overflow-hidden whitespace-nowrap"
              >
                <span className="text-base font-bold tracking-tight text-text-primary leading-tight">
                  IntelliReview
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">
                  AI Reviewer
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 py-6 overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={linkClass}
            title={isCollapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={cn(
                      "absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary",
                      isCollapsed ? "left-0" : "left-0"
                    )}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary")} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border/50 flex flex-col gap-2">
        <button
          onClick={logout}
          title={isCollapsed ? "Log out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-error/10 hover:text-error",
            isCollapsed ? "justify-center px-0" : "px-3"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={toggleCollapse}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary",
            isCollapsed ? "justify-center px-0" : "px-3"
          )}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5 shrink-0" /> : <ChevronLeft className="h-5 w-5 shrink-0" />}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300",
          isCollapsed ? "lg:w-[80px]" : "lg:w-[260px]"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
