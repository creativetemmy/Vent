
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import UserHeader from '@/components/VentCard/UserHeader';
import VentContent from '@/components/VentCard/VentContent';
import TagsMentions from '@/components/VentCard/TagsMentions';
import EvidenceImage from '@/components/VentCard/EvidenceImage';
import VentFooter from '@/components/VentCard/VentFooter';
import VoteButtons from '@/components/VentCard/VoteButtons';
import { useToast } from '@/hooks/use-toast';

interface VentCardProps {
  vent: any;
}

const VentCard: React.FC<VentCardProps> = ({ vent }) => {
  const router = useRouter();
  const { session } = useAuth();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(0);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [upvotes, setUpvotes] = useState(vent.upvotes || 0);
  const [downvotes, setDownvotes] = useState(vent.downvotes || 0);
  const [votesOnThisVent, setVotesOnThisVent] = useState(0);
  const [loadingVote, setLoadingVote] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const loadData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', session.user.id)
        .maybeSingle();
      
      setUserPoints(profile?.points || 0);
      
      const { data: vote } = await supabase
        .from('user_votes')
        .select('vote_type')
        .eq('vent_id', vent.id)
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      setUserVote(vote?.vote_type || null);
      
      const { count } = await supabase
        .from('user_votes')
        .select('*', { count: 'exact', head: true })
        .eq('vent_id', vent.id);
      
      setVotesOnThisVent(count ?? 0);
    };
    loadData();
  }, [session?.user?.id, vent.id]);

  const handleCardClick = () => {
    router.push(`/vent/${vent.id}`);
  };

  const handleVote = async (type: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote on vents.",
        variant: "destructive",
      });
      return;
    }
    
    if (userPoints < 5) {
      toast({
        title: "Insufficient Points",
        description: "You need at least 5 stars to vote.",
        variant: "destructive",
      });
      return;
    }

    if (loadingVote) return;
    setLoadingVote(true);
    
    try {
      // If user already voted the same way, remove their vote
      if (userVote === type) {
        await supabase.from('user_votes').delete().eq('vent_id', vent.id).eq('user_id', session.user.id);
        
        if (type === 'up') {
          await supabase.from('vents').update({ upvotes: upvotes - 1 }).eq('id', vent.id);
          setUpvotes(prev => prev - 1);
        } else {
          await supabase.from('vents').update({ downvotes: downvotes - 1 }).eq('id', vent.id);
          setDownvotes(prev => prev - 1);
        }
        
        setUserVote(null);
      } else {
        // If changing vote from one type to another, update existing vote
        if (userVote) {
          await supabase.from('user_votes')
            .update({ vote_type: type })
            .eq('vent_id', vent.id)
            .eq('user_id', session.user.id);
          
          if (type === 'up') {
            await supabase.from('vents')
              .update({ upvotes: upvotes + 1, downvotes: downvotes - 1 })
              .eq('id', vent.id);
            
            setUpvotes(prev => prev + 1);
            setDownvotes(prev => prev - 1);
          } else {
            await supabase.from('vents')
              .update({ upvotes: upvotes - 1, downvotes: downvotes + 1 })
              .eq('id', vent.id);
            
            setUpvotes(prev => prev - 1);
            setDownvotes(prev => prev + 1);
          }
        } 
        // If new vote
        else {
          await supabase.from('user_votes').insert({
            vent_id: vent.id,
            user_id: session.user.id,
            vote_type: type
          });
          
          if (type === 'up') {
            await supabase.from('vents').update({ upvotes: upvotes + 1 }).eq('id', vent.id);
            setUpvotes(prev => prev + 1);
          } else {
            await supabase.from('vents').update({ downvotes: downvotes + 1 }).eq('id', vent.id);
            setDownvotes(prev => prev + 1);
          }
        }
        
        setUserVote(type);
      }
      
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Vote Error",
        description: "Failed to register your vote.",
        variant: "destructive",
      });
    } finally {
      setLoadingVote(false);
    }
  };

  return (
    <div className="w-full max-w-[343px] bg-vent-card rounded-lg mb-4 overflow-hidden">
      <div className="p-4 cursor-pointer" onClick={handleCardClick}>
        <UserHeader userId={vent.user_id} timestamp={vent.created_at} />
        <VentContent content={vent.content} />
        <TagsMentions hashtags={vent.hashtags} mentions={vent.mentions} />
        <EvidenceImage evidence={vent.evidence} />
      </div>
      <VentFooter
        upvotes={upvotes}
        downvotes={downvotes}
        commentCount={vent.comment_count || 0}
      />
      <div className="flex border-t border-gray-700">
        <VoteButtons
          userVote={userVote}
          onVote={handleVote}
          loadingVote={loadingVote}
          upvotes={upvotes}
          downvotes={downvotes}
        />
        <button 
          onClick={handleCardClick}
          className="flex-1 py-2 flex justify-center items-center gap-1 text-vent-muted hover:bg-gray-800"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
};

export default VentCard;
