
import React from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

interface VoteButtonsProps {
  userPoints: number | null;
  votesOnThisVent: number;
  voteLimit: number;
  voteCost: number;
  loadingVote: boolean;
  upvotes: number;
  downvotes: number;
  handleVote: (type: 'upvote' | 'downvote', e: React.MouseEvent) => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  userPoints,
  votesOnThisVent,
  voteLimit,
  voteCost,
  loadingVote,
  upvotes,
  downvotes,
  handleVote,
}) => (
  <>
    <button
      className="flex items-center gap-1"
      onClick={e => handleVote('upvote', e)}
      disabled={userPoints === null || userPoints < voteCost || votesOnThisVent >= voteLimit || loadingVote}
    >
      <ThumbsUp className={`h-5 w-5 ${userPoints !== null && userPoints >= voteCost && votesOnThisVent < voteLimit ? 'text-green-500' : 'text-gray-500'}`} />
      <span className="text-green-500 text-sm">{upvotes ?? 0}</span>
      <Star className="h-3 w-3 text-yellow-500 ml-1" />
      <span className="text-yellow-500 text-xs">{voteCost}</span>
    </button>
    <button
      className="flex items-center gap-1"
      onClick={e => handleVote('downvote', e)}
      disabled={userPoints === null || userPoints < voteCost || votesOnThisVent >= voteLimit || loadingVote}
    >
      <ThumbsDown className={`h-5 w-5 ${userPoints !== null && userPoints >= voteCost && votesOnThisVent < voteLimit ? 'text-red-500' : 'text-gray-500'}`} />
      <span className="text-red-500 text-sm">{downvotes ?? 0}</span>
      <Star className="h-3 w-3 text-yellow-500 ml-1" />
      <span className="text-yellow-500 text-xs">{voteCost}</span>
    </button>
  </>
);

export default VoteButtons;
