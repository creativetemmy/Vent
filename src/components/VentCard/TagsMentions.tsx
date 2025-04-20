
import React from "react";

interface TagsMentionsProps {
  hashtags?: string[];
  mentions?: string[];
}

const TagsMentions: React.FC<TagsMentionsProps> = ({ hashtags, mentions }) => (
  <div className="flex flex-wrap gap-1 ml-auto">
    {(hashtags ?? []).map((tag, idx) => (
      <span key={idx} className="text-twitter text-sm cursor-pointer hover:underline">
        {tag}
      </span>
    ))}
    {(mentions ?? []).map((mention, idx) => (
      <span key={idx} className="text-twitter text-sm cursor-pointer hover:underline ml-1">
        {mention}
      </span>
    ))}
  </div>
);

export default TagsMentions;
