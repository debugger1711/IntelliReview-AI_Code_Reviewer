import React from 'react';
import { Card, CardContent } from './ui/Card';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, trend, trendLabel, delay = 0 }) => {
  const isPositive = trend > 0;
  
  return (
    <Card animate className="hover:shadow-md transition-shadow" style={{ transitionDelay: `${delay}ms` }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-text-secondary">
              {label}
            </span>
            <span className="text-2xl font-bold text-text-primary">
              {value}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center space-x-2 text-sm">
            <span
              className={`font-medium ${
                isPositive ? 'text-success' : 'text-error'
              }`}
            >
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span className="text-text-secondary">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
