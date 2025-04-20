
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { supabase } from "@/integrations/supabase/client";

const FarcasterAuthButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { toast } = useToast();
  // useSignIn takes no arguments, use as default
  const { signIn, isSuccess, isPolling, data } = useSignIn();

  const handleSignIn = async () => {
    try {
      await signIn();

      if (data && data.fid) {
        toast({ title: "Connected!", description: "Wallet and Farcaster account connected." });

        try {
          // Use custody_address as the user's wallet/DID
          const custodyAddress = data.custody_address?.toLowerCase() || "";
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
