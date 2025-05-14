
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

// Define a custom type that extends the Supabase vent type with optional txHash
type VentWithTxHash = Tables<'vents'> & { txHash?: string };

interface VentCardProps {
  vent: VentWithTxHash;
}

const VOTE_COST = 10;
const VOTE_LIMIT = 5;

const VentCard: React.FC<VentCardProps> = ({ vent }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { session } = useAuth();

  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [votesOnThisVent, setVotesOnThisVent] = useState<number>(0);
  const [loadingVote, setLoadingVote] = useState(false);
  const [profile, setProfile] = useState<any>(null);

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (vent.user_id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', vent.user_id)
          .maybeSingle();
        setProfile(data);
      }
    };
    fetchUserProfile();
  }, [vent.user_id]);

  const handleCardClick = () => {
    router.push(`/vent/${vent.id}`);
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

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="w-[343px] h-auto min-h-[150px] bg-vent-card rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-700 transition-colors animate-fade-in"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-2 mb-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-white font-medium text-sm">{profile?.username || 'Anonymous'}</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-400 text-xs">{formatDate(vent.created_at)}</span>
          </div>
          <p className="text-gray-400 text-xs">@{profile?.username || 'anon'}</p>
        </div>
      </div>
      
      <p className="text-white text-sm mb-3">{vent.content}</p>
      
      <div className="flex justify-between mb-3">
        {vent.evidence && (
          <div className="relative overflow-hidden rounded-lg h-20 w-20" onClick={(e) => e.stopPropagation()}>
            <a href={vent.evidence} target="_blank" rel="noopener noreferrer">
              <img src={vent.evidence} alt="Evidence" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <ExternalLink className="h-5 w-5 text-white" />
              </div>
            </a>
          </div>
        )}
        <div className="flex flex-col space-y-1">
          {vent.hashtags && vent.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {vent.hashtags.map((tag, idx) => (
                <span key={idx} className="text-twitter text-xs">#{tag}</span>
              ))}
            </div>
          )}
          {vent.mentions && vent.mentions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {vent.mentions.map((mention, idx) => (
                <span key={idx} className="text-twitter text-xs">@{mention}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-gray-400 text-xs border-t border-gray-700 pt-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button
              disabled={loadingVote}
              className={`p-1 rounded-full hover:bg-gray-600 ${
                votesOnThisVent >= VOTE_LIMIT ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => handleVote('upvote', e)}
            >
              <ChevronUp className="h-4 w-4 text-white" />
            </button>
            <span className="text-white">{vent.upvotes || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              disabled={loadingVote}
              className={`p-1 rounded-full hover:bg-gray-600 ${
                votesOnThisVent >= VOTE_LIMIT ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={(e) => handleVote('downvote', e)}
            >
              <ChevronDown className="h-4 w-4 text-white" />
            </button>
            <span className="text-white">{vent.downvotes || 0}</span>
          </div>
        </div>
        
        {vent.txHash && (
          <Link 
            href={`https://etherscan.io/tx/${vent.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center text-twitter hover:underline"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            <span>Verified on chain</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default VentCard;
