
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
import { useAuth } from "@/contexts/AuthContext";
import { useSignIn } from "@farcaster/auth-kit";

export function FarcasterConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { session, farcasterUser } = useAuth();
  // Using useSignIn without any configuration arguments
  const { signIn, isPolling, data, error } = useSignIn();

  useEffect(() => {
    // Check if user has already connected Farcaster
    const checkFarcasterConnection = async () => {
      if (!session?.user) {
        setIsOpen(false);
        return;
      }

      setIsOpen(!farcasterUser);
    };

    checkFarcasterConnection();
  }, [session, farcasterUser]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await signIn();
    } catch (error: any) {
      console.error('Error connecting Farcaster:', error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect your Farcaster account. Please try again.",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  // Don't show the dialog if user is not logged in
  if (!session?.user) {
    return null;
  }

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
            disabled={isConnecting || isPolling}
            className="w-full bg-twitter hover:bg-twitter/90"
          >
            {isConnecting || isPolling ? "Connecting..." : "Connect Farcaster"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
