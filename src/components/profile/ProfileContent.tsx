
import React from 'react';
import ProfileVentCard from './ProfileVentCard';
import VoteCard from './VoteCard';
import PointsHistoryCard from './PointsHistoryCard';
import { Vent } from '@/data/vents';

// Types for the mock data
interface Vote {
  id: string;
  type: 'upvote' | 'downvote';
  username: string;
  project: string;
  content: string;
}

interface PointsHistoryItem {
  id: string;
  date: string;
  action: string;
  points: number;
  content: string;
}

interface ProfileContentProps {
  activeTab: 'vents' | 'votes' | 'history';
  userVents: Vent[];
  userVotes: Vote[];
  pointsHistory: PointsHistoryItem[];
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  userVents,
  userVotes,
  pointsHistory
}) => {
  return (
    <div className="max-w-[343px] mx-auto">
      {activeTab === 'vents' && (
        <>
          {userVents.map(vent => (
            <ProfileVentCard key={vent.id} vent={vent} />
          ))}
        </>
      )}
      
      {activeTab === 'votes' && (
        <>
          {userVotes.map(vote => (
            <VoteCard key={vote.id} vote={vote} />
          ))}
        </>
      )}
      
      {activeTab === 'history' && (
        <>
          {pointsHistory.map(item => (
            <PointsHistoryCard key={item.id} item={item} />
          ))}
        </>
      )}
    </div>
  );
};

export default ProfileContent;
