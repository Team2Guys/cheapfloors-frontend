'use client';
import { useState } from 'react';

interface Tab {
  label: React.ReactNode;
  value: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (_value: string) => void;
  isLogin?: boolean;
}

const Tabs = ({
  tabs,
  defaultTab,
  className = '',
  onTabChange,
  isLogin
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].value);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className={`max-w-[90%] mx-auto mt-5 ${className}`}>
      <div className="flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`py-2 px-4 md:text-2xl font-medium ${
              activeTab === tab.value
                ? `text-primary ${isLogin ? 'border-b-2 border-b-primary' : ''}`
                : `hover:text-primary ${isLogin ? 'hover:border-b-2 hover:border-b-primary' : ''}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map(
          (tab) =>
            activeTab === tab.value && <div key={tab.value}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
