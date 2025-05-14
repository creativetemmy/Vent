
'use client';

import React from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'top', label: 'Top Vents' },
    { id: 'project', label: 'By Project' },
    { id: 'sentiment', label: 'By Sentiment' },
    { id: 'my', label: 'My Vents' },
  ];

  return (
    <div className="h-tabs border-b border-gray-800 overflow-x-auto hide-scrollbar">
      <div className="flex h-full min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 h-full flex items-center whitespace-nowrap text-sm relative
              ${activeTab === tab.id ? 'text-twitter font-medium' : 'text-white'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-twitter" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
