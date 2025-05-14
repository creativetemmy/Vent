
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import VentDetailsHeader from './VentDetailsHeader';
import VentBody from './VentBody';
import CounterVentSection from './CounterVentSection';
import { useVentDetails } from '@/hooks/useVentDetails';

const VentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ventId = id ?? '';
  
  const {
    vent,
    counterVents,
    counterReply,
    setCounterReply,
    isPostingReply,
    userPoints,
    handlePostCounterVent,
  } = useVentDetails(ventId);

  if (!vent) {
    return (
      <div className="min-h-screen bg-vent-bg flex flex-col items-center justify-center">
        <p className="text-white text-xl">Vent not found</p>
        <button className="mt-4 bg-twitter hover:bg-twitter/90 text-white p-2 rounded" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <VentDetailsHeader onBack={() => navigate(-1)} />

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
};

export default VentDetails;
