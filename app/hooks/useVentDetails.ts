
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const COUNTER_VENT_COST = 20;

export const useVentDetails = (ventId: string) => {
  const { session } = useAuth();
  const { toast } = useToast();

  const [vent, setVent] = useState<any>(null);
  const [counterVents, setCounterVents] = useState<any[]>([]);
  const [counterReply, setCounterReply] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);

  useEffect(() => {
    async function fetchVentAndReplies() {
      if (!ventId) return;
      const { data: ventData } = await supabase
        .from('vents')
        .select('*')
        .eq('id', ventId)
        .maybeSingle();
      setVent(ventData);

      const { data: replies } = await supabase
        .from('vents')
        .select('*')
        .eq('parent_id', ventId)
        .order('created_at', { ascending: true });
      setCounterVents(replies || []);
    }
    fetchVentAndReplies();
  }, [ventId, isPostingReply]);

  useEffect(() => {
    if (!ventId) return;
    const channel = supabase
      .channel('public:vents')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vents' },
        (payload) => {
          if (payload.new.parent_id === ventId) {
            setCounterVents((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ventId]);

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
      parent_id: ventId,
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

  return {
    vent,
    counterVents,
    counterReply,
    setCounterReply,
    isPostingReply,
    userPoints,
    handlePostCounterVent,
  };
};
