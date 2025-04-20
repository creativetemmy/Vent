
import React from "react";
import UserHeader from "../VentCard/UserHeader";
import VentContent from "../VentCard/VentContent";
import TagsMentions from "../VentCard/TagsMentions";
import EvidenceImage from "../VentCard/EvidenceImage";
import VentFooter from "../VentCard/VentFooter";

interface LiveVentPreviewProps {
  content: string;
  evidence: string | null;
  tags: string[];
  userId: string;
  upvotes?: number;
  downvotes?: number;
  points?: number;
  createdAt?: string;
}

const LiveVentPreview: React.FC<LiveVentPreviewProps> = ({
  content,
  evidence,
  tags,
  userId,
  upvotes = 0,
  downvotes = 0,
  points = 0,
  createdAt,
}) => {
  return (
    <div className="w-full max-w-[343px] mx-auto bg-vent-card rounded-lg p-4 mb-4" aria-label="Preview vent card">
      <UserHeader userId={userId} createdAt={createdAt || undefined} />
      <VentContent content={content || "Your vent preview..."} />
      <div className="flex justify-between mb-3">
        {evidence ? (
          <EvidenceImage url={evidence} onClick={() => {}} alt="Preview evidence image" />
        ) : (
          <div className="h-24 w-24 rounded bg-vent-muted flex items-center justify-center meta">No image</div>
        )}
        <TagsMentions hashtags={tags.filter((t) => t.startsWith("#"))} mentions={tags.filter((t) => t.startsWith("@"))} />
      </div>
      <VentFooter
        userPoints={points}
        votesOnThisVent={0}
        voteLimit={5}
        voteCost={10}
        loadingVote={false}
        upvotes={upvotes}
        downvotes={downvotes}
        handleVote={() => {}}
        commentsCount={0}
      />
    </div>
  );
};

export default LiveVentPreview;
