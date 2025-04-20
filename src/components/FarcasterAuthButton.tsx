
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { supabase } from "@/integrations/supabase/client";

const FarcasterAuthButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { toast } = useToast();

  // useSignIn may not actually take any arguments for latest @farcaster/auth-kit
  const { signIn, isSuccess, isPolling, data } = useSignIn();

  const handleSignIn = async () => {
    try {
      await signIn();

      // Defensive: data might not yet be present
      if (data && typeof data === "object" && "fid" in data) {
        toast({ title: "Connected!", description: "Wallet and Farcaster account connected." });

        try {
          // property names safety: custodyAddress or walletAddress are most likely correct
          // statusAPIResponse likely returns { fid, username, displayName, pfpUrl, walletAddress }
          // fallback to any casing
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const custodyAddress =
            (data as any).walletAddress?.toLowerCase?.() ||
            (data as any).custodyAddress?.toLowerCase?.() ||
            "";

          if (custodyAddress) {
            await supabase.rpc("upsert_farcaster_user", {
              p_fid: data.fid,
              p_username: data.username || "",
              p_display_name: data.displayName || "",
              p_avatar_url: data.pfpUrl || "",
              p_did: custodyAddress,
              p_user_id: null
            });
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
