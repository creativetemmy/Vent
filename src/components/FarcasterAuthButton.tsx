
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { supabase } from "@/integrations/supabase/client";

const FarcasterAuthButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { toast } = useToast();
  // Configure useSignIn with the correct parameters according to the Farcaster auth-kit
  const { signIn, isSuccess, isPolling, data } = useSignIn({
    // According to Farcaster's auth-kit, these are the correct parameters
    // https://docs.farcaster.xyz/auth-kit/sign-in/client
    siweUri: window.location.origin,
    domain: window.location.host,
  });

  const handleSignIn = async () => {
    try {
      await signIn();

      if (data && data.fid) {
        toast({ title: "Connected!", description: "Wallet and Farcaster account connected." });

        try {
          // Get the wallet address from the correct property in Farcaster response
          // Looking at the Farcaster auth-kit types, we need to access these properties carefully
          const custodyAddress = data?.custody_address?.toLowerCase() || "";
          if (custodyAddress) {
            const { error } = await supabase.rpc("upsert_farcaster_user", {
              p_fid: data.fid,
              p_username: data.username || "",
              p_display_name: data.displayName || "",
              p_avatar_url: data.pfpUrl || "",
              p_did: custodyAddress,
              p_user_id: null
            });
            if (error) throw error;
          }
        } catch (err) {
          console.error("Error storing Farcaster data:", err);
        }

        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error("Farcaster auth error:", err);
      toast({
        title: "Farcaster Sign-In Error",
        description: err?.message || "Unknown error.",
        variant: "destructive"
      });
    }
  };

  return (
    <SignInButton
      onSuccess={handleSignIn}
    />
  );
};

export default FarcasterAuthButton;
