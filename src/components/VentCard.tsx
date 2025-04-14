import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share, Star, Link, Wallet } from 'lucide-react';
import { Vent } from '../data/vents';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface VentCardProps {
  vent: Vent;
}

const VentCard: React.FC<VentCardProps> = ({ vent }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(30); // Mock user points
  const VOTE_COST = 10;
  
  const handleCardClick = () => {
    navigate(`/vent/${vent.id}`);
  };
  
  const handleVote = (type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (userPoints < VOTE_COST) {
      toast({
        title: "Insufficient Points",
        description: `You need ${VOTE_COST} stars to vote. You currently have ${userPoints}.`,
        variant: "destructive",
      });
      return;
    }
    
    // Deduct points
    setUserPoints(prev => prev - VOTE_COST);
    
    toast({
      title: "Vote Registered",
      description: `Your ${type === 'up' ? 'upvote' : 'downvote'} has been registered and ${VOTE_COST} stars have been deducted.`,
    });
    
    // Would update in backend
    console.log(`Voted ${type} on vent ${vent.id}`);
  };
  
  const handleEvidenceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vent.image) {
      // Open evidence in full screen or modal
      window.open(vent.image, '_blank');
    }
  };
  
  return (
    <div 
      className="w-[343px] h-auto min-h-[150px] bg-vent-card rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-700 transition-colors animate-fade-in"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">{vent.username}</span>
          <Wallet className="h-4 w-4 text-twitter" />
        </div>
        <span className="text-sm text-vent-muted">{vent.timeAgo}</span>
      </div>
      
      <p className="text-base mb-3 line-clamp-2">{vent.content}</p>
      
      <div className="flex justify-between mb-3">
        {vent.image && (
          <div className="hover-scale" onClick={handleEvidenceClick}>
            <div className="relative">
              <img 
                src={vent.image} 
                alt="Vent evidence" 
                className="h-16 w-16 object-cover rounded"
              />
              <Link className="absolute bottom-1 right-1 h-4 w-4 text-white bg-black/50 rounded-full p-0.5" />
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 ml-auto">
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
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-1"
            onClick={(e) => handleVote('up', e)}
            disabled={userPoints < VOTE_COST}
          >
            <ThumbsUp className={`h-5 w-5 ${userPoints >= VOTE_COST ? 'text-green-500' : 'text-gray-500'}`} />
            <span className="text-green-500 text-sm">{vent.upvotes}</span>
            <Star className="h-3 w-3 text-yellow-500 ml-1" />
            <span className="text-yellow-500 text-xs">{VOTE_COST}</span>
          </button>
          
          <button 
            className="flex items-center gap-1"
            onClick={(e) => handleVote('down', e)}
            disabled={userPoints < VOTE_COST}
          >
            <ThumbsDown className={`h-5 w-5 ${userPoints >= VOTE_COST ? 'text-red-500' : 'text-gray-500'}`} />
            <span className="text-red-500 text-sm">{vent.downvotes}</span>
            <Star className="h-3 w-3 text-yellow-500 ml-1" />
            <span className="text-yellow-500 text-xs">{VOTE_COST}</span>
          </button>
          
          <div className="flex items-center gap-1">
            <MessageSquare className="h-5 w-5 text-white" />
            <span className="text-white text-sm">{vent.comments}</span>
          </div>
        </div>
        
        <div onClick={(e) => e.stopPropagation()}>
          <Share className="h-5 w-5 text-white cursor-pointer" />
        </div>
      </div>
      
      {vent.txHash && (
        <div className="mt-2 text-xs text-twitter hover:underline">
          <a 
            href={`https://optimistic.etherscan.io/tx/${vent.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  );
};

export default VentCard;
