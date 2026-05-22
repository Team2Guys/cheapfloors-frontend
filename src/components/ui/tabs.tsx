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
  variant?: 'default' | 'product-detail';
}

const Tabs = ({
  tabs,
  defaultTab,
  className = '',
  onTabChange,
  isLogin,
  variant = 'default'
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].value);

  const handleTabClick = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  if (variant === 'product-detail') {
    return (
      <div className={`w-full mt-6 sm:mt-8 ${className}`}>
        <div className="flex bg-[#FAFAFA] px-2 py-3 xs:p-4 gap-4 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabClick(tab.value)}
              className={`py-2 px-2 sm:px-6 text-sm xs:text-base sm:text-2xl font-semibold border transition-colors w-fit ${
                activeTab === tab.value
                  ? 'bg-primary text-black border-primary'
                  : 'bg-white text-black border-[#D9D9D9] hover:border-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4 sm:mt-6 text-black">
          {tabs.map(
            (tab) =>
              activeTab === tab.value && <div key={tab.value}>{tab.content}</div>
          )}
        </div>
      </div>
    );
  }

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
