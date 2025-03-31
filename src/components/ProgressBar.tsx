
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  className 
}) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>进度</span>
        <span>{current}/{total} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-teal-400 to-blue-400 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
