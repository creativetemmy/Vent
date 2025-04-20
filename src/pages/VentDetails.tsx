import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import VentDetailsHeader from './VentDetailsHeader';
import VentMain from './VentMain';
import CounterVentList from './CounterVentList';
import CounterVentForm from './CounterVentForm';

const COUNTER_VENT_COST = 20;

const VentDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const { toast } = useToast();

  const [vent, setVent] = useState<any>(null);
  const [counterVents, setCounterVents] = useState<any[]>([]);
  const [counterReply, setCounterReply] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);

  // Fetch vent and replies (counter-vents)
  useEffect(() => {
    async function fetchVentAndReplies() {
      if (!id) return;
      // Fetch the main vent
      const { data: ventData } = await supabase
        .from('vents')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setVent(ventData);

      // Fetch replies (counter-vents)
      const { data: replies } = await supabase
        .from('vents')
        .select('*')
        .eq('parent_id', id)
        .order('created_at', { ascending: true });
      setCounterVents(replies || []);
    }
    fetchVentAndReplies();
  }, [id, isPostingReply]);

  // Listen for new counter-vents in realtime
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

    // Return cleanup function directly
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Fetch the logged-in user's points for reply button logic
  useEffect(() => {
    if (!session?.user) return;
    async function fetchPoints() {
      const { data } = await supabase.from('profiles').select('points').eq('id', session.user.id).maybeSingle();
      setUserPoints(data?.points ?? 0);
    }
    fetchPoints();
  }, [session?.user, isPostingReply]);

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

    // Add child vent (reply)
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

    // Deduct 20 points
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
      {/* Header */}
      <VentDetailsHeader onBack={() => navigate(-1)} />

      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-[72px] px-4">
        <ScrollArea className="w-full max-w-[343px] mx-auto h-[calc(100vh-56px-64px-32px)]">
          <VentMain vent={vent} />
          <div className="mb-4">
            <h2 className="text-white text-lg font-semibold mb-3">Counter-Vents</h2>
            <CounterVentList counterVents={counterVents} />
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
};

export default VentDetails;

// Note: This file is now refactored. You should consider further splitting files as functionality grows.
