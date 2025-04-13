
import React from 'react';
import { CheckCircle, ThumbsDown } from 'lucide-react';
import { UserVote } from '@/hooks/useUserProfile';

interface VoteCardProps {
  vote: UserVote;
}

const VoteCard: React.FC<VoteCardProps> = ({ vote }) => {
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

export default VoteCard;
