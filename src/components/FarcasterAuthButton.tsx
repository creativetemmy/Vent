
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSignIn } from "@farcaster/auth-kit";
import { LogIn, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  // Detect if MetaMask is installed
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(true);

  useEffect(() => {
    // Detect window.ethereum as injected by MetaMask
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setHasMetaMask(true);
    } else {
      setHasMetaMask(false);
    }
  }, []);

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
    <>
      {/* If MetaMask is not installed, show a prominent warning */}
      {!hasMetaMask ? (
        <div className="w-full flex items-center gap-2 border border-red-500 bg-red-100/80 text-red-700 px-4 py-3 rounded-lg mb-2 font-medium text-base">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Install <a
            href="https://metamask.io/download.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-red-600 ml-1 mr-1"
          >MetaMask</a> to enable wallet sign-in.
        </div>
      ) : (
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
      )}
    </>
  );
};

export default FarcasterAuthButton;
