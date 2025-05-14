
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const { session, loading, farcasterUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      // Check for either a Supabase session or Farcaster user data
      if (session || farcasterUser || localStorage.getItem('fid')) {
        router.push('/home');
      } else {
        router.push('/auth');
      }
    }
  }, [session, farcasterUser, loading, router]);

  // Simple loading state until auth is determined
  return (
    <div className="min-h-screen bg-vent-bg flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  );
}
