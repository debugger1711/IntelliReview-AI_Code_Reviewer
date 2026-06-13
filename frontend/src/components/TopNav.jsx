import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from './ui/Avatar';
import { Search, Sun, Moon, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const TopNav = ({ title, subtitle, toggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="flex flex-col min-w-0 mr-4">
        {title && <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary truncate">{title}</h1>}
        {subtitle && <p className="text-xs sm:text-sm text-text-secondary truncate hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Placeholder */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-secondary/70"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Dropdown Placeholder */}
        <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-border bg-surface py-1 pl-1 pr-2 sm:pr-3 transition-colors hover:bg-surface/80 cursor-pointer">
          <Avatar
            fallback={getInitials(user?.name)}
            className="h-7 w-7 bg-primary text-primary-foreground border-none"
          />
          <span className="text-sm font-medium text-text-primary hidden sm:block">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
          <button onClick={logout} className="ml-1 text-text-secondary hover:text-error transition-colors" title="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
