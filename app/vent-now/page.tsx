
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import VentForm from '@/components/VentNow/VentForm';

export default function VentNowPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!loading && !session) {
      router.push('/');
    }
  }, [session, loading, router]);

  if (loading || !session) {
    return <div className="min-h-screen bg-vent-bg flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <VentForm />
    </div>
  );
}
