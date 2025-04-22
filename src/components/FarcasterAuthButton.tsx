
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSignIn } from "@farcaster/auth-kit";
import { LogIn, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type FarcasterAuthButtonProps = {
  onSuccess?: () => void;
};

const GRADIENT =
  "bg-gradient-to-r from-[#1DA1F2] to-[#7B61FF]";

const FarcasterAuthButton: React.FC<FarcasterAuthButtonProps> = ({
  onSuccess,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  // Handle successful Farcaster auth data
  useEffect(() => {
    if (isSuccess && data && typeof data === "object" && "fid" in data) {
      const handleSuccessfulAuth = async () => {
        try {
          // Standardize address field casing and upsert to Supabase
          const custodyAddress =
            (data as any).walletAddress?.toLowerCase?.() ||
            (data as any).custodyAddress?.toLowerCase?.() ||
            "";
            
          if (custodyAddress) {
            // Store Farcaster user in Supabase
            const { data: userData, error } = await supabase.rpc("upsert_farcaster_user", {
              p_fid: data.fid,
              p_username: data.username || "",
              p_display_name: data.displayName || "",
              p_avatar_url: data.pfpUrl || "",
              p_did: custodyAddress,
              p_user_id: null,
            });
            
            if (error) {
              console.error("Error storing Farcaster data:", error);
              return;
            }
            
            // Sign into Supabase with custom token
            // Note: We're using the FID as a unique identifier
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: `farcaster-${data.fid}@example.com`,
              password: `fc-${data.fid}-${custodyAddress.substring(0, 8)}`,
            });
            
            if (authError) {
              // If login failed, try to sign up
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: `farcaster-${data.fid}@example.com`,
                password: `fc-${data.fid}-${custodyAddress.substring(0, 8)}`,
                options: {
                  data: {
                    fid: data.fid,
                    username: data.username,
                    display_name: data.displayName,
                    avatar_url: data.pfpUrl,
                    farcaster_user: true
                  }
                }
              });
              
              if (signUpError) {
                console.error("Error signing up:", signUpError);
                toast({
                  title: "Authentication Failed",
                  description: "Could not create a user session. Please try again.",
                  variant: "destructive",
                });
                return;
              }
            }
            
            toast({
              title: "Connected!",
              description: "Wallet and Farcaster account connected.",
            });
            
            if (onSuccess) onSuccess();
            
            // Navigate to home page
            navigate("/");
          }
        } catch (err) {
          console.error("Farcaster auth processing error:", err);
          toast({
            title: "Authentication Error",
            description: "Failed to complete authentication process.",
            variant: "destructive",
          });
        }
      };
      
      handleSuccessfulAuth();
    }
  }, [isSuccess, data, toast, onSuccess, navigate]);

  const handleSignIn = async () => {
    try {
      await signIn();
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
