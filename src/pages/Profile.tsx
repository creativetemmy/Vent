
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { Vent } from '@/data/vents';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileContent from '@/components/profile/ProfileContent';

// Mock data for profile
const mockUserVents: Vent[] = [
  {
    id: '1',
    username: '@user.eth',
    timeAgo: '2h ago',
    content: 'Uniswap fees ate my ETH! Swapped 1 ETH for 0.5 DAI...',
    upvotes: 12,
    downvotes: 3,
    comments: 5,
    hashtags: ['#Uniswap'],
    mentions: ['@Uniswap'],
    image: 'https://via.placeholder.com/80'
  }
];

// Mock data for user votes
const mockUserVotes = [
  {
    id: '1',
    type: 'upvote',
    username: '@user2.eth',
    project: 'Aave',
    content: 'Aave\'s new update is amazing!'
  },
  {
    id: '2',
    type: 'downvote',
    username: '@user3.eth',
    project: 'Lens',
    content: 'Lens protocol has too many bugs'
  }
];

// Mock data for points history
const mockPointsHistory = [
  {
    id: '1',
    date: 'Apr 10, 2025',
    action: 'Vented',
    points: -20,
    content: 'Uniswap fees ate my ETH!'
  },
  {
    id: '2',
    date: 'Apr 9, 2025',
    action: 'Upvoted',
    points: -10,
    content: '@user2.eth\'s Aave vent'
  },
  {
    id: '3',
    date: 'Apr 8, 2025',
    action: 'Downvoted',
    points: -10,
    content: '@user3.eth\'s Lens vent'
  }
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vents' | 'votes' | 'history'>('vents');
  
  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Profile</h1>
          
          <div className="w-10" />
        </div>
      </header>
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-footer px-4">
        <ProfileHeader 
          username="@user.eth"
          walletAddress="0x123...456"
          points={100}
          resetDate="Apr 1, 2025"
          ventsCount={3}
          votesCount={5}
        />
        
        <ProfileTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <ProfileContent 
          activeTab={activeTab}
          userVents={mockUserVents}
          userVotes={mockUserVotes}
          pointsHistory={mockPointsHistory}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
