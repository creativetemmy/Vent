
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the home page
    router.push('/home');
  }, [router]);

  // Simple loading state until redirect
  return (
    <div className="min-h-screen bg-vent-bg flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  );
}
