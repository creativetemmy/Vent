
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <div className="min-h-screen bg-vent-bg flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  );
}
