
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { supabase } from "@/integrations/supabase/client";

const FARCASTER_CLIENT_ID = "farcaster.xyz"; // Adjust if needed

const FarcasterAuthButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { signIn, isSuccess, isPolling, data } = useSignIn();

  const handleSignIn = async () => {
    try {
      await signIn({ domain: window.location.host, siweUri: window.location.origin });
      
      if (data && data.fid) {
        toast({ title: "Connected!", description: "Wallet and Farcaster account connected." });

        // Optionally upsert DID or connect account in Supabase here
        try {
          const did = data.walletAddress?.toLowerCase() || "";
          
          if (did) {
            // Use the upsert function to store the DID
            const { error } = await supabase.rpc("upsert_farcaster_user", {
              p_fid: data.fid,
              p_username: data.username || "",
              p_display_name: data.displayName || "",
              p_avatar_url: data.pfpUrl || "",
              p_did: did,
              p_user_id: null // Link to auth user later if needed
            });
            
            if (error) throw error;
          }
        } catch (err) {
          console.error("Error storing Farcaster data:", err);
        }
        
        if (onSuccess) onSuccess();
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
    <SignInButton
      onSuccess={handleSignIn}
    />
  );
};

export default FarcasterAuthButton;
