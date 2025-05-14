
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getIPFSUrl } from '@/utils/ipfs';
import VentDetailsHeader from '@/components/VentDetailsHeader';
import CounterVentForm from '@/components/CounterVentForm';

const COUNTER_VENT_COST = 20;

export default function VentDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { session } = useAuth();
  const { toast } = useToast();

  const [vent, setVent] = useState<any>(null);
  const [counterVents, setCounterVents] = useState<any[]>([]);
  const [counterReply, setCounterReply] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);

  useEffect(() => {
    async function fetchVentAndReplies() {
      if (!id) return;
      const { data: ventData } = await supabase
        .from('vents')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setVent(ventData);

      const { data: replies } = await supabase
        .from('vents')
        .select('*')
        .eq('parent_id', id)
        .order('created_at', { ascending: true });
      setCounterVents(replies || []);
    }
    fetchVentAndReplies();
  }, [id, isPostingReply]);

  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel('public:vents')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vents' },
        (payload) => {
          if (payload.new.parent_id === id) {
            setCounterVents((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    async function fetchPoints() {
      const { data } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', session.user.id)
        .maybeSingle();
      setUserPoints(data?.points ?? 0);
    }
    fetchPoints();
  }, [session?.user?.id, isPostingReply]);

  const handlePostCounterVent = async () => {
    if (!session?.user) return;
    
    if (!counterReply.trim()) {
      toast({ title: "Reply Required", description: "Type your counter-vent before posting.", variant: "destructive" });
      return;
    }
    if ((userPoints ?? 0) < COUNTER_VENT_COST) {
      toast({ title: "Insufficient Points", description: `You need ${COUNTER_VENT_COST} stars to post a counter-vent.`, variant: "destructive" });
      return;
    }
    setIsPostingReply(true);

    const { error: replyError } = await supabase.from('vents').insert([{
      user_id: session.user.id,
      content: counterReply,
      parent_id: id,
    }]);
    if (replyError) {
      toast({ title: "Counter-Vent Error", description: replyError.message, variant: "destructive" });
      setIsPostingReply(false);
      return;
    }

    const { error: pointError } = await supabase
      .from('profiles')
      .update({ points: (userPoints ?? 0) - COUNTER_VENT_COST })
      .eq('id', session.user.id);
    if (pointError) {
      toast({ title: "Point Deduction Error", description: pointError.message, variant: "destructive" });
    } else {
      setUserPoints((userPoints ?? 0) - COUNTER_VENT_COST);
      setCounterReply('');
      toast({ title: "Counter-Vent Posted", description: `Your counter-vent was posted and ${COUNTER_VENT_COST} stars deducted.` });
    }
    setIsPostingReply(false);
  };

  function renderEvidence(ventData: any) {
    if (!ventData) return null;
    if (ventData.ipfs_cid) {
      const cid = ventData.ipfs_cid;
      const url = getIPFSUrl(cid);
      return (
        <div className="mb-3">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-twitter underline font-semibold"
            aria-label="IPFS CID evidence"
          >
            Evidence CID: {cid.slice(0, 8)}...{cid.slice(-6)}
          </a>
        </div>
      );
    }
    if (ventData.evidence) {
      return (
        <div className="mb-3">
          <img
            src={ventData.evidence}
            alt="Evidence image"
            className="w-full h-auto max-h-[200px] object-cover rounded border"
          />
        </div>
      );
    }
    return null;
  }

  function renderEtherscan(ventData: any) {
    if (ventData?.tx_hash) {
      return (
        <div className="mb-3">
          <a
            href={`https://optimistic.etherscan.io/tx/${ventData.tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 underline"
          >
            View on Etherscan
          </a>
        </div>
      );
    }
    return null;
  }

  if (!vent) {
    return (
      <div className="min-h-screen bg-vent-bg flex flex-col items-center justify-center">
        <p className="text-white text-xl">Vent not found</p>
        <button className="mt-4 bg-twitter hover:bg-twitter/90 text-white p-2 rounded" onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <VentDetailsHeader onBack={() => window.history.back()} />

      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-[72px] px-4">
        <ScrollArea className="w-full max-w-[343px] mx-auto h-[calc(100vh-56px-64px-32px)]">
          <div className="w-full max-w-[343px] bg-[#4A4A4A] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-base text-white" style={{ fontFamily: "Inter" }}>
                {vent.user_id.slice(0, 6)}...{vent.user_id.slice(-4)}
              </span>
              <span className="text-sm text-vent-muted">
                {vent.created_at ? new Date(vent.created_at).toLocaleString() : ""}
              </span>
            </div>
            <p className="text-base mb-3 text-white" style={{ fontFamily: "Inter" }}>{vent.content}</p>
            {renderEvidence(vent)}
            {renderEtherscan(vent)}
            <div className="flex flex-wrap gap-1 mb-3">
              {(vent.hashtags ?? []).map((tag: string, index: number) => (
                <span key={index} className="text-twitter text-sm cursor-pointer hover:underline" style={{ fontFamily: "Inter" }}>
                  {tag}
                </span>
              ))}
              {(vent.mentions ?? []).map((m: string, idx: number) => (
                <span key={idx} className="text-twitter text-sm cursor-pointer hover:underline ml-1" style={{ fontFamily: "Inter" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-white text-lg font-semibold mb-3" style={{ fontFamily: "Inter" }}>Counter-Vents</h2>
            {counterVents.map(cv => (
              <div key={cv.id} className="w-full max-w-[343px] bg-[#333] rounded-lg p-4 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-base text-white" style={{ fontFamily: "Inter" }}>
                    {cv.user_id.slice(0, 6)}...{cv.user_id.slice(-4)}
                  </span>
                  <span className="text-sm text-vent-muted">
                    {cv.created_at ? new Date(cv.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <p className="text-base mb-3 text-white" style={{ fontFamily: "Inter" }}>{cv.content}</p>
                {renderEvidence(cv)}
                {renderEtherscan(cv)}
              </div>
            ))}
            <CounterVentForm
              counterReply={counterReply}
              setCounterReply={setCounterReply}
              isPostingReply={isPostingReply}
              handlePostCounterVent={handlePostCounterVent}
              userPoints={userPoints}
              COUNTER_VENT_COST={COUNTER_VENT_COST}
            />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
