
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { session } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!session) {
      router.push('/auth');
    }
  }, [session, router]);

  // If no session yet, show loading
  if (!session) {
    return <div className="min-h-screen bg-vent-bg flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-vent-bg">
      <h1 className="text-white text-2xl p-6">Welcome to Vent</h1>
      <p className="text-vent-muted p-6">This is the Next.js version of the Vent app.</p>
    </div>
  );
}
