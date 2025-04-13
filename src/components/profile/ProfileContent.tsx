
import React from 'react';
import ProfileVentCard from './ProfileVentCard';
import VoteCard from './VoteCard';
import PointsHistoryCard from './PointsHistoryCard';
import { Vent } from '@/data/vents';
import { UserVote, PointsHistoryItem } from '@/hooks/useUserProfile';

interface ProfileContentProps {
  activeTab: 'vents' | 'votes' | 'history';
  userVents: Vent[];
  userVotes: UserVote[];
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
          {userVents.length > 0 ? (
            userVents.map(vent => (
              <ProfileVentCard key={vent.id} vent={vent} />
            ))
          ) : (
            <div className="text-center text-vent-muted py-8">
              No vents yet
            </div>
          )}
        </>
      )}
      
      {activeTab === 'votes' && (
        <>
          {userVotes.length > 0 ? (
            userVotes.map(vote => (
              <VoteCard key={vote.id} vote={vote} />
            ))
          ) : (
            <div className="text-center text-vent-muted py-8">
              No votes yet
            </div>
          )}
        </>
      )}
      
      {activeTab === 'history' && (
        <>
          {pointsHistory.length > 0 ? (
            pointsHistory.map(item => (
              <PointsHistoryCard key={item.id} item={item} />
            ))
          ) : (
            <div className="text-center text-vent-muted py-8">
              No points history yet
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileContent;
