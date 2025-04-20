
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSignIn } from "@farcaster/auth-kit";
import { supabase } from "@/integrations/supabase/client";
import { LogIn } from "lucide-react";

type FarcasterAuthButtonProps = {
  onSuccess?: () => void;
};

const GRADIENT =
  "bg-gradient-to-r from-[#1DA1F2] to-[#7B61FF]";

const FarcasterAuthButton: React.FC<FarcasterAuthButtonProps> = ({
  onSuccess,
}) => {
  const { toast } = useToast();
  const { signIn, isPolling, isSuccess, data } = useSignIn({});

  const handleSignIn = async () => {
    try {
      await signIn();
      if (data && typeof data === "object" && "fid" in data) {
        toast({
          title: "Connected!",
          description: "Wallet and Farcaster account connected.",
        });
        try {
          // Standardize address field casing and upsert to Supabase
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
              p_user_id: null,
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
        variant: "destructive",
      });
    }
  };

  return (
    <button
      type="button"
      className={`${GRADIENT} w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-white font-semibold text-base shadow-lg hover:brightness-105 transition-all relative`}
      style={{
        minHeight: 48,
        fontSize: 18,
      }}
      onClick={handleSignIn}
      disabled={isPolling}
      aria-label="Sign in with Farcaster"
    >
      <LogIn className="mr-2 h-5 w-5 opacity-90" />
      {isPolling
        ? "Connecting..."
        : "Sign In with Farcaster Wallet"}
    </button>
  );
};

export default FarcasterAuthButton;
