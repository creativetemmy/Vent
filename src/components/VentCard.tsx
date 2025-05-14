
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import EvidenceImage from "./VentCard/EvidenceImage";
import TagsMentions from "./VentCard/TagsMentions";
import UserHeader from "./VentCard/UserHeader";
import VentContent from "./VentCard/VentContent";
import VentFooter from "./VentCard/VentFooter";

interface VentCardProps {
  vent: Tables<'vents'> & { txHash?: string };
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

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const loadData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', session.user.id)
        .maybeSingle();
      setUserPoints(profile?.points ?? 0);

      const { count } = await supabase
        .from('user_votes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('vent_id', vent.id);
      setVotesOnThisVent(count ?? 0);
    };
    loadData();
  }, [session?.user?.id, vent.id]);

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
      <UserHeader userId={vent.user_id} createdAt={vent.created_at} />
      <VentContent content={vent.content} />
      <div className="flex justify-between mb-3">
        {vent.evidence && (
          <EvidenceImage url={vent.evidence} onClick={handleEvidenceClick} />
        )}
        <TagsMentions hashtags={vent.hashtags} mentions={vent.mentions} />
      </div>
      <VentFooter
        userPoints={userPoints}
        votesOnThisVent={votesOnThisVent}
        voteLimit={VOTE_LIMIT}
        voteCost={VOTE_COST}
        loadingVote={loadingVote}
        upvotes={vent.upvotes ?? 0}
        downvotes={vent.downvotes ?? 0}
        handleVote={handleVote}
        txHash={vent.txHash}
      />
    </div>
  );
};

export default VentCard;
