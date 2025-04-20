
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { SignInButton, useSignIn, useAccount } from "@farcaster/auth-kit";
import { supabase } from "@/integrations/supabase/client";

const FARCASTER_CLIENT_ID = "farcaster.xyz"; // Adjust if needed

const FarcasterAuthButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { signIn } = useSignIn();
  const { isConnected, address, did, username } = useAccount();

  const handleSignIn = async () => {
    try {
      const response = await signIn({ clientId: FARCASTER_CLIENT_ID });
      if (response && response.did) {
        toast({ title: "Connected!", description: "Wallet and Farcaster account connected." });

        // Optionally upsert DID or connect account in Supabase here
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Farcaster Sign-In Failed",
          description: "No DID returned from wallet, try again.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Farcaster Sign-In Error",
        description: err?.message || "Unknown error.",
        variant: "destructive"
      });
    }
  };

  return (
    <SignInButton onSignIn={handleSignIn} disabled={isConnected} />
  );
};

export default FarcasterAuthButton;
