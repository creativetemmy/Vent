
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function FarcasterConnect() {
  const [isOpen, setIsOpen] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already connected Farcaster
    const checkFarcasterConnection = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsOpen(true);
        return;
      }

      const { data: farcasterUser } = await supabase
        .from('farcaster_users')
        .select()
        .eq('user_id', session.user.id)
        .single();

      setIsOpen(!farcasterUser);
    };

    checkFarcasterConnection();
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Mock Farcaster connection for now
      // TODO: Implement actual Farcaster authentication
      toast({
        title: "Connect your Farcaster account",
        description: "This feature is coming soon!",
      });
    } catch (error) {
      console.error('Error connecting Farcaster:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect your Farcaster account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-vent-card text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Connect Your Farcaster Account
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-center text-vent-muted">
            Connect your Farcaster account to start venting and engaging with the community.
          </p>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-twitter hover:bg-twitter/90"
          >
            {isConnecting ? "Connecting..." : "Connect Farcaster"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
