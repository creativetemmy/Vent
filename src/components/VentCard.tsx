
import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share } from 'lucide-react';
import { Vent } from '../data/vents';
import { useNavigate } from 'react-router-dom';

interface VentCardProps {
  vent: Vent;
}

const VentCard: React.FC<VentCardProps> = ({ vent }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/vent/${vent.id}`);
  };
  
  return (
    <div 
      className="w-full max-w-[343px] bg-vent-card rounded-lg p-3 mb-3 cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-base">{vent.username}</span>
        <span className="text-sm text-vent-muted">{vent.timeAgo}</span>
      </div>
      
      <p className="text-base mb-2 line-clamp-2">{vent.content}</p>
      
      {vent.image && (
        <div className="mb-2">
          <img 
            src={vent.image} 
            alt="Vent evidence" 
            className="h-20 w-20 object-cover rounded"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 mb-3">
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
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-sm">{vent.upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4 text-red-500" />
            <span className="text-red-500 text-sm">{vent.downvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-white" />
            <span className="text-white text-sm">{vent.comments}</span>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Share className="h-4 w-4 text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default VentCard;
