
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import Footer from '@/components/Footer';
import { Vent } from '@/data/vents';

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

const ProfileVentCard: React.FC<{ vent: Vent }> = ({ vent }) => {
  return (
    <div className="w-full bg-vent-card rounded-lg p-3 mb-3">
      <p className="text-base mb-2">{vent.content}</p>
      
      {vent.image && (
        <div className="mb-2">
          <img 
            src={vent.image} 
            alt="Vent evidence" 
            className="h-20 w-20 object-cover rounded"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 mb-1">
        {vent.hashtags.map((tag, index) => (
          <span key={index} className="text-twitter text-sm cursor-pointer hover:underline">
            {tag}
          </span>
        ))}
        {vent.mentions.map((mention, index) => (
          <span key={index} className="text-twitter text-sm cursor-pointer hover:underline ml-1">
            {mention}
          </span>
        ))}
      </div>
    </div>
  );
};

const VoteCard: React.FC<{ vote: typeof mockUserVotes[0] }> = ({ vote }) => {
  return (
    <div className="w-full bg-vent-card rounded-lg p-3 mb-3">
      <div className="flex items-center gap-2">
        {vote.type === 'upvote' ? (
          <>
            <span className="text-white text-sm">Upvoted:</span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </>
        ) : (
          <>
            <span className="text-white text-sm">Downvoted:</span>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </>
        )}
        <span className="text-white text-sm">{vote.username}'s {vote.project} vent</span>
      </div>
      <p className="text-sm text-vent-muted mt-1">{vote.content}</p>
    </div>
  );
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vents' | 'votes'>('vents');
  
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
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">@user.eth</h2>
          
          <div className="flex items-center gap-1 text-vent-muted mb-4">
            <Wallet className="h-4 w-4" />
            <span className="text-sm">0x123...456</span>
          </div>
          
          <div className="bg-gradient-to-r from-twitter to-[#7B61FF] rounded-lg px-6 py-2 mb-4">
            <span className="text-xl font-bold text-white">100 Points</span>
          </div>
          
          <div className="flex gap-6 text-sm text-white">
            <div>Vents Posted: 3</div>
            <div>Votes Cast: 5</div>
          </div>
        </div>
        
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
          </div>
        </div>
        
        <div className="max-w-[343px] mx-auto">
          {activeTab === 'vents' ? (
            <>
              {mockUserVents.map(vent => (
                <ProfileVentCard key={vent.id} vent={vent} />
              ))}
            </>
          ) : (
            <>
              {mockUserVotes.map(vote => (
                <VoteCard key={vote.id} vote={vote} />
              ))}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
