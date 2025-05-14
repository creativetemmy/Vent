
import React, { useEffect, useState } from 'react';
import VentCard from './VentCard';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Define a custom type that extends the Supabase vent type with optional txHash
type VentWithTxHash = Tables<'vents'> & { txHash?: string };

const Feed: React.FC = () => {
  const [vents, setVents] = useState<VentWithTxHash[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all top-level vents (parent_id is null)
  useEffect(() => {
    async function fetchVents() {
      const { data, error } = await supabase
        .from('vents')
        .select('*')
        .eq('parent_id', null)
        .order('created_at', { ascending: false });

      if (!error && data) setVents(data);
      setLoading(false);
    }
    fetchVents();

    // Realtime subscription for new vents
    const channel = supabase
      .channel('public:vents')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vents' },
        (payload) => {
          const newVent = payload.new as VentWithTxHash;
          // Only push if it's a top-level vent
          if (!newVent.parent_id) {
            setVents((prev) => [newVent, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center py-8 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center py-4 w-full">
      {vents.length === 0 && (
        <div className="text-vent-muted py-8">No vents yet.</div>
      )}
      {vents.map(vent => (
        <VentCard key={vent.id} vent={vent} />
      ))}
    </div>
  );
};

export default Feed;
