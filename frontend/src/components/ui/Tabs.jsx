import React, { createContext, useContext, forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const TabsContext = createContext();

const Tabs = ({ defaultValue, value, onValueChange, className, children }) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const handleTabChange = (val) => {
    if (value === undefined) {
      setActiveTab(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const currentTab = value !== undefined ? value : activeTab;

  return (
    <TabsContext.Provider value={{ currentTab, onTabChange: handleTabChange }}>
      <div className={cn("flex flex-col", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-surface p-1 text-text-secondary border border-border w-fit",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = forwardRef(({ className, value, children, ...props }, ref) => {
  const { currentTab, onTabChange } = useContext(TabsContext);
  const isActive = currentTab === value;
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onTabChange(value)}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "text-text-primary" : "hover:text-text-primary",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-background rounded-sm shadow-sm"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = forwardRef(({ className, value, children, ...props }, ref) => {
  const { currentTab } = useContext(TabsContext);
  if (currentTab !== value) return null;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
