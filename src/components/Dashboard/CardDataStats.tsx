'use client';

import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  children: ReactNode;
  className?: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  children,
  className
}) => {
  return (
    <div
      className={`rounded-md shadow dark:border px-7 py-6 relative overflow-hidden bg-white dark:bg-transparent ${className}`}
    >
      <div className="flex h-full w-28 items-center justify-end pr-4 rounded-full bg-primary dark:text-black dark:bg-white absolute -top-0 left-0 -translate-x-1/2">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between ml-10">
        <div>
          <h4 className="text-title-md font-bold text-primary dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium text-primary dark:text-white">
            {title}
          </span>
        </div>
      </div>
      <div className="bg-primary h-28 w-28 dark:bg-white rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
    </div>
  );
};

export default CardDataStats;
