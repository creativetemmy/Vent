
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Tabs from '@/app/components/Tabs';
import Feed from '@/app/components/Feed';
import Footer from '@/app/components/Footer';
import { FarcasterConnect } from '@/components/FarcasterConnect';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('top');
  const { session, loading, farcasterUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (!loading && !session && !farcasterUser && !localStorage.getItem('fid')) {
      router.push('/auth');
    }
  }, [session, farcasterUser, loading, router]);
  
  // Show loading indicator while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-vent-bg flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-footer">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Feed />
      </main>
      
      <Footer />
      <FarcasterConnect />
    </div>
  );
}
