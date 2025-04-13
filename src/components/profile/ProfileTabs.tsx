
import React from 'react';

interface ProfileTabsProps {
  activeTab: 'vents' | 'votes' | 'history';
  setActiveTab: (tab: 'vents' | 'votes' | 'history') => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-tabs border-b border-gray-800 mb-4">
      <div className="flex h-full">
        <button
          className={`px-4 h-full flex items-center text-sm relative
            ${activeTab === 'vents' ? 'text-twitter font-medium' : 'text-white'}`}
          onClick={() => setActiveTab('vents')}
        >
          My Vents
          {activeTab === 'vents' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-twitter" />
          )}
        </button>
        <button
          className={`px-4 h-full flex items-center text-sm relative
            ${activeTab === 'votes' ? 'text-twitter font-medium' : 'text-white'}`}
          onClick={() => setActiveTab('votes')}
        >
          My Votes
          {activeTab === 'votes' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-twitter" />
          )}
        </button>
        <button
          className={`px-4 h-full flex items-center text-sm relative
            ${activeTab === 'history' ? 'text-twitter font-medium' : 'text-white'}`}
          onClick={() => setActiveTab('history')}
        >
          Points History
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-twitter" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileTabs;
