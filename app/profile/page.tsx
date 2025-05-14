
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileContent from '@/components/profile/ProfileContent';
import useUserProfile from '@/hooks/useUserProfile';

export default function ProfilePage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const profile = useUserProfile();
  
  React.useEffect(() => {
    if (!loading && !session) {
      router.push('/auth');
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return <div className="min-h-screen bg-vent-bg flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-footer">
        <ProfileHeader profile={profile} />
        <ProfileContent profile={profile} />
      </main>
      
      <Footer />
    </div>
  );
}
