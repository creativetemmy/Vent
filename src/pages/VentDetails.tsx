import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share, ThumbsUp, ThumbsDown, MessageSquare, Check, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
      const { data: ventData, error: ventError } = await supabase
        .from('vents')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setVent(ventData);

      // Fetch replies (counter-vents)
      const { data: replies, error: replyError } = await supabase
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
    
    // Fix: Return cleanup function directly without wrapping in another function
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
        <Button 
          onClick={() => navigate('/')} 
          className="mt-4 bg-twitter hover:bg-twitter/90"
        >
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
        <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <h1 className="text-xl font-bold text-white">Vent Details</h1>
          
          <button className="text-white p-2">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-[72px] px-4">
        <ScrollArea className="w-full max-w-[343px] mx-auto h-[calc(100vh-56px-64px-32px)]">
          {/* Main Vent Card */}
          <div className="w-full max-w-[343px] bg-[#4A4A4A] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-base text-white">{vent.user_id.slice(0, 6)}...{vent.user_id.slice(-4)}</span>
              <span className="text-sm text-vent-muted">{vent.created_at ? new Date(vent.created_at).toLocaleString() : ""}</span>
            </div>
            <p className="text-base mb-3 text-white">{vent.content}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {(vent.hashtags ?? []).map((tag: string, index: number) => (
                <span key={index} className="text-twitter text-sm cursor-pointer hover:underline">
                  {tag}
                </span>
              ))}
              {(vent.mentions ?? []).map((m: string, idx: number) => (
                <span key={idx} className="text-twitter text-sm cursor-pointer hover:underline ml-1">
                  {m}
                </span>
              ))}
            </div>
            {vent.evidence && (
              <div className="mb-3">
                <img 
                  src={vent.evidence} 
                  alt="Vent evidence" 
                  className="w-full h-auto max-h-[200px] object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Counter-Vents Section */}
          <div className="mb-4">
            <h2 className="text-white text-lg font-semibold mb-3">Counter-Vents</h2>

            {counterVents.length === 0 && (
              <div className="text-vent-muted py-4">No counter-vents yet.</div>
            )}
            {counterVents.map((cv) => (
              <div key={cv.id} className="w-full max-w-[343px] bg-vent-card rounded-lg p-3 mb-3 ml-4 border-l-2 border-gray-600">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-white">{cv.user_id.slice(0,6)}...{cv.user_id.slice(-4)}</span>
                  <span className="text-xs text-vent-muted">
                    {cv.created_at ? new Date(cv.created_at).toLocaleString() : ""}
                  </span>
                </div>
                <p className="text-sm mb-2 text-white">{cv.content}</p>
                {cv.evidence && (
                  <div className="mb-2">
                    <img 
                      src={cv.evidence} 
                      alt="Counter vent evidence" 
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 mt-4">
              <textarea
                className="w-full rounded p-2 resize-none bg-[#262626] text-white"
                rows={3}
                placeholder="Write your counter-vent..."
                value={counterReply}
                onChange={e => setCounterReply(e.target.value)}
                disabled={isPostingReply}
              />
              <div className="flex items-center gap-2">
                <Button 
                  className="bg-twitter hover:bg-twitter/90 h-10 px-4 flex items-center gap-2"
                  onClick={handlePostCounterVent}
                  disabled={isPostingReply || (userPoints !== null && userPoints < COUNTER_VENT_COST)}
                >
                  <MessageSquare className="h-4 w-4" />
                  {isPostingReply ? "Posting..." : `Add Counter-Vent (${COUNTER_VENT_COST} 🌟)`}
                </Button>
                <span className="text-white text-xs">
                  Available: {userPoints ?? "--"} ⭐
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default VentDetails;

// Note: This file is now 242 lines long. You should consider refactoring it into smaller files for maintainability.
