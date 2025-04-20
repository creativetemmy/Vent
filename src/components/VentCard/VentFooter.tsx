
import React from "react";
import { MessageSquare, Share } from "lucide-react";
import VoteButtons from "./VoteButtons";

interface VentFooterProps {
  userPoints: number | null;
  votesOnThisVent: number;
  voteLimit: number;
  voteCost: number;
  loadingVote: boolean;
  upvotes: number;
  downvotes: number;
  handleVote: (type: "upvote" | "downvote", e: React.MouseEvent) => void;
  commentsCount?: number | string;
  txHash?: string;
  onShareClick?: (e: React.MouseEvent) => void;
  onCommentClick?: (e: React.MouseEvent) => void;
}

const VentFooter: React.FC<VentFooterProps> = ({
  userPoints,
  votesOnThisVent,
  voteLimit,
  voteCost,
  loadingVote,
  upvotes,
  downvotes,
  handleVote,
  commentsCount,
  txHash,
  onShareClick,
  onCommentClick
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-4">
      <VoteButtons
        userPoints={userPoints}
        votesOnThisVent={votesOnThisVent}
        voteLimit={voteLimit}
        voteCost={voteCost}
        loadingVote={loadingVote}
        upvotes={upvotes}
        downvotes={downvotes}
        handleVote={handleVote}
      />
      <div className="flex items-center gap-1" onClick={onCommentClick}>
        <MessageSquare className="h-5 w-5 text-white" />
        <span className="text-white text-sm">{commentsCount || "–"}</span>
      </div>
    </div>
    <div onClick={e => {e.stopPropagation(); onShareClick && onShareClick(e);}}>
      <Share className="h-5 w-5 text-white cursor-pointer" />
    </div>
    {txHash && (
      <div className="ml-4 text-xs text-twitter hover:underline">
        <a
          href={`https://optimistic.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          View on Etherscan
        </a>
      </div>
    )}
  </div>
);

export default VentFooter;
