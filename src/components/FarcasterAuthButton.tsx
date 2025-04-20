
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { SignInButton, useSignIn } from "@farcaster/auth-kit";
import { supabase } from "@/integrations/supabase/client";

const FARCASTER_CLIENT_ID = "farcaster.xyz"; // Adjust if needed

const FarcasterAuthButton: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { toast } = useToast();
  // Fix error 1: Pass required config parameter to useSignIn
  const { signIn, isSuccess, isPolling, data } = useSignIn({ 
    domain: window.location.host,
    siweUri: window.location.origin 
  });

  const handleSignIn = async () => {
    try {
      // Fix error 2: Don't pass arguments to signIn() as they're already in useSignIn
      await signIn();
      
      if (data && data.fid) {
        toast({ title: "Connected!", description: "Wallet and Farcaster account connected." });

        // Fix error 3: Use the correct property name from StatusAPIResponse
        try {
          // The property is "did" according to the Farcaster API, not walletAddress
          const did = data.did?.toLowerCase() || "";
          
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
