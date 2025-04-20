import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Vent } from '@/data/vents';

export interface UserVote {
  id: string;
  type: 'upvote' | 'downvote';
  username: string;
  project: string;
  content: string;
}

export interface PointsHistoryItem {
  id: string;
  date: string;
  action: string;
  points: number;
  content: string;
  tx_hash?: string;
}

export interface UserProfile {
  username: string;
  walletAddress: string;
  points: number;
  resetDate: string;
  ventsCount: number;
  votesCount: number;
  userVents: Vent[];
  userVotes: UserVote[];
  pointsHistory: PointsHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

const useUserProfile = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    walletAddress: '',
    points: 0,
    resetDate: '',
    ventsCount: 0,
    votesCount: 0,
    userVents: [],
    userVotes: [],
    pointsHistory: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user) {
        setProfile(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      try {
        const userData = {
          username: session.user.email ? `@${session.user.email.split('@')[0]}.eth` : '@user.eth',
          walletAddress: `0x${session.user.id.substring(0, 3)}...${session.user.id.substring(session.user.id.length - 3)}`,
          points: 100,
          resetDate: 'Apr 1, 2025',
          ventsCount: 3,
          votesCount: 5,
          userVents: [
            {
              id: '1',
              username: session.user.email ? `@${session.user.email.split('@')[0]}.eth` : '@user.eth',
              timeAgo: '2h ago',
              content: 'Uniswap fees ate my ETH! Swapped 1 ETH for 0.5 DAI...',
              upvotes: 12,
              downvotes: 3,
              comments: 5,
              hashtags: ['#Uniswap'],
              mentions: ['@Uniswap'],
              image: 'https://via.placeholder.com/80'
            }
          ],
          userVotes: [
            {
              id: '1',
              type: 'upvote' as 'upvote',
              username: '@user2.eth',
              project: 'Aave',
              content: 'Aave\'s new update is amazing!'
            },
            {
              id: '2',
              type: 'downvote' as 'downvote',
              username: '@user3.eth',
              project: 'Lens',
              content: 'Lens protocol has too many bugs'
            }
          ],
          pointsHistory: [
            {
              id: '1',
              date: 'Apr 10, 2025',
              action: 'Vented',
              points: -20,
              content: 'Uniswap fees ate my ETH!',
              tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            },
            {
              id: '2',
              date: 'Apr 9, 2025',
              action: 'Upvoted',
              points: -10,
              content: '@user2.eth\'s Aave vent'
            },
            {
              id: '3',
              date: 'Apr 8, 2025',
              action: 'Downvoted',
              points: -10,
              content: '@user3.eth\'s Lens vent'
            }
          ]
        };

        setProfile({
          ...userData,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load profile data'
        }));
      }
    };

    fetchUserProfile();
  }, [session]);

  return profile;
};

export default useUserProfile;
