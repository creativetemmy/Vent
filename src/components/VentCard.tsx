
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share, Star, Link, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

interface VentCardProps {
  vent: Tables<'vents'>;
}

const VOTE_COST = 10;
const VOTE_LIMIT = 5;

const VentCard: React.FC<VentCardProps> = ({ vent }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [votesOnThisVent, setVotesOnThisVent] = useState<number>(0);
  const [loadingVote, setLoadingVote] = useState(false);

  // Fetch user's points and their count of votes for this vent
  useEffect(() => {
    if (!session?.user) return;
    const loadData = async () => {
      // Get user points
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', session.user.id)
        .maybeSingle();
      setUserPoints(profile?.points ?? 0);

      // Count user votes on this vent
      const { count } = await supabase
        .from('user_votes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('vent_id', vent.id);
      setVotesOnThisVent(count ?? 0);
    };
    loadData();
  }, [session?.user, vent.id]);

  const handleCardClick = () => {
    navigate(`/vent/${vent.id}`);
  };

  const handleVote = async (type: 'upvote' | 'downvote', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user) {
      toast({ title: "Not logged in", description: "You must be logged in to vote.", variant: "destructive" });
      return;
    }
    if (userPoints === null) return;

    if (userPoints < VOTE_COST) {
      toast({
        title: "Insufficient Points",
        description: `You need ${VOTE_COST} stars to vote. You currently have ${userPoints}.`,
        variant: "destructive",
      });
      return;
    }

    if (votesOnThisVent >= VOTE_LIMIT) {
      toast({
        title: "Vote limit reached",
        description: `You can only vote ${VOTE_LIMIT} times on this vent.`,
        variant: "destructive",
      });
      return;
    }

    setLoadingVote(true);
    // Add a row to user_votes
    const { error } = await supabase.from('user_votes').insert([
      {
        user_id: session.user.id,
        vent_id: vent.id,
        vote_type: type,
      }
    ]);
    if (error) {
      toast({ title: "Vote Error", description: error.message, variant: "destructive" });
      setLoadingVote(false);
      return;
    }

    // Deduct points
    const { error: setPointsError } = await supabase
      .from('profiles')
      .update({ points: (userPoints ?? 0) - VOTE_COST })
      .eq('id', session.user.id);

    if (setPointsError) {
      toast({ title: "Point Deduction Error", description: setPointsError.message, variant: "destructive" });
    } else {
      setUserPoints(userPoints - VOTE_COST);
      setVotesOnThisVent(votesOnThisVent + 1);
      toast({
        title: "Vote Registered",
        description: `Your ${type === 'upvote' ? 'upvote' : 'downvote'} has been registered and ${VOTE_COST} stars have been deducted.`,
      });
    }
    setLoadingVote(false);
  };

  const handleEvidenceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vent.evidence) {
      window.open(vent.evidence, '_blank');
    }
  };

  return (
    <div 
      className="w-[343px] h-auto min-h-[150px] bg-vent-card rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-700 transition-colors animate-fade-in"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">{vent.user_id.slice(0, 6)}...{vent.user_id.slice(-4)}</span>
          <Wallet className="h-4 w-4 text-twitter" />
        </div>
        <span className="text-sm text-vent-muted">
          {vent.created_at ? new Date(vent.created_at).toLocaleString() : ""}
        </span>
      </div>

      <p className="text-base mb-3 line-clamp-2">{vent.content}</p>

      <div className="flex justify-between mb-3">
        {vent.evidence && (
          <div className="hover-scale" onClick={handleEvidenceClick}>
            <div className="relative">
              <img 
                src={vent.evidence} 
                alt="Vent evidence" 
                className="h-16 w-16 object-cover rounded"
              />
              <Link className="absolute bottom-1 right-1 h-4 w-4 text-white bg-black/50 rounded-full p-0.5" />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1 ml-auto">
          {(vent.hashtags ?? []).map((tag, index) => (
            <span key={index} className="text-twitter text-sm cursor-pointer hover:underline">
              {tag}
            </span>
          ))}
          {(vent.mentions ?? []).map((mention, index) => (
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
            onClick={(e) => handleVote('upvote', e)}
            disabled={userPoints === null || userPoints < VOTE_COST || votesOnThisVent >= VOTE_LIMIT || loadingVote}
          >
            <ThumbsUp className={`h-5 w-5 ${userPoints !== null && userPoints >= VOTE_COST && votesOnThisVent < VOTE_LIMIT ? 'text-green-500' : 'text-gray-500'}`} />
            <span className="text-green-500 text-sm">{vent.upvotes ?? 0}</span>
            <Star className="h-3 w-3 text-yellow-500 ml-1" />
            <span className="text-yellow-500 text-xs">{VOTE_COST}</span>
          </button>
          
          <button 
            className="flex items-center gap-1"
            onClick={(e) => handleVote('downvote', e)}
            disabled={userPoints === null || userPoints < VOTE_COST || votesOnThisVent >= VOTE_LIMIT || loadingVote}
          >
            <ThumbsDown className={`h-5 w-5 ${userPoints !== null && userPoints >= VOTE_COST && votesOnThisVent < VOTE_LIMIT ? 'text-red-500' : 'text-gray-500'}`} />
            <span className="text-red-500 text-sm">{vent.downvotes ?? 0}</span>
            <Star className="h-3 w-3 text-yellow-500 ml-1" />
            <span className="text-yellow-500 text-xs">{VOTE_COST}</span>
          </button>

          <div className="flex items-center gap-1">
            <MessageSquare className="h-5 w-5 text-white" />
            {/* The comments count will be the number of counter-vents (replies); handled in VentDetails */}
            <span className="text-white text-sm">–</span>
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
