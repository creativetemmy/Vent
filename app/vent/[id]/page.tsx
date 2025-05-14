
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import VentDetailsHeader from '@/components/VentDetailsHeader';
import VentBody from '@/components/VentBody';
import CounterVentSection from '@/components/CounterVentSection';
import { useVentDetails } from '@/app/hooks/useVentDetails';

export default function VentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const {
    vent,
    counterVents,
    counterReply,
    setCounterReply,
    isPostingReply,
    userPoints,
    handlePostCounterVent,
  } = useVentDetails(id);

  if (!vent) {
    return (
      <div className="min-h-screen bg-vent-bg flex flex-col items-center justify-center">
        <p className="text-white text-xl">Vent not found</p>
        <button className="mt-4 bg-twitter hover:bg-twitter/90 text-white p-2 rounded" onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <VentDetailsHeader onBack={() => router.back()} />

      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-[72px] px-4">
        <ScrollArea className="w-full max-w-[343px] mx-auto h-[calc(100vh-56px-64px-32px)]">
          <VentBody vent={vent} />
          <CounterVentSection
            counterVents={counterVents}
            counterReply={counterReply}
            setCounterReply={setCounterReply}
            isPostingReply={isPostingReply}
            handlePostCounterVent={handlePostCounterVent}
            userPoints={userPoints}
          />
        </ScrollArea>
      </main>
    </div>
  );
}
