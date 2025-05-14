
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileTabs from '@/components/profile/ProfileTabs';
import useUserProfile from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'vents' | 'votes' | 'history'>('vents');
  const profile = useUserProfile();
  
  useEffect(() => {
    if (!loading && !session) {
      router.push('/');
    }
  }, [session, loading, router]);

  // Show error toast if profile fails to load
  useEffect(() => {
    if (profile.error) {
      toast({
        title: 'Error',
        description: profile.error,
        variant: 'destructive',
      });
    }
  }, [profile.error, toast]);

  if (loading || !session) {
    return <div className="min-h-screen bg-vent-bg flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-footer px-4">
        {profile.isLoading ? (
          // Loading skeleton
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-700 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-700 rounded-lg w-full"></div>
            <div className="h-32 bg-gray-700 rounded-lg w-full"></div>
          </div>
        ) : (
          <>
            <ProfileHeader 
              username={profile.username}
              walletAddress={profile.walletAddress}
              points={profile.points}
              resetDate={profile.resetDate}
              ventsCount={profile.ventsCount}
              votesCount={profile.votesCount}
            />
            
            <ProfileTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <ProfileContent 
              activeTab={activeTab}
              userVents={profile.userVents}
              userVotes={profile.userVotes}
              pointsHistory={profile.pointsHistory}
            />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
