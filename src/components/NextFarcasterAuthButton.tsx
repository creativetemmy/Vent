
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSignIn } from "@farcaster/auth-kit";
import { LogIn, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";

type NextFarcasterAuthButtonProps = {
  onSuccess?: () => void;
};

const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster/user";
const NEYNAR_API_KEY = "2725A6F7-8E91-419F-80F0-8ED75BDB8223";
const GRADIENT = "bg-gradient-to-r from-[#1DA1F2] to-[#7B61FF]";

const NextFarcasterAuthButton: React.FC<NextFarcasterAuthButtonProps> = ({
  onSuccess,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  // Using useSignIn with configuration argument
  const { signIn, isSuccess, isPolling, error, data } = useSignIn({});
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasMetaMask(!!(window as any).ethereum);
    }
  }, []);

  // Handle authentication success
  useEffect(() => {
    if (isSuccess && data) {
      const handleSuccessfulAuth = async () => {
        try {
          // Fetch user data from Neynar API
          const res = await fetch(
            `${NEYNAR_API_URL}/lookup?fid=${data.fid}`,
            {
              headers: {
                "accept": "application/json",
                "api_key": NEYNAR_API_KEY
              }
            }
          );

          if (!res.ok) {
            throw new Error(`Failed to resolve Farcaster user data: ${res.status}`);
          }

          const neynarData = await res.json();
          
          if (!neynarData.result?.user) {
            throw new Error("No user data found from Neynar");
          }
          
          const user = neynarData.result.user;
          const custodyAddress = (user.custody_address || "").toLowerCase();
          
          if (!custodyAddress) {
            throw new Error("No custody address found for user");
          }

          // Upsert the Farcaster user in database
          const { error: upsertError } = await supabase.rpc("upsert_farcaster_user", {
            p_fid: user.fid,
            p_username: user.username,
            p_display_name: user.display_name || "",
            p_avatar_url: user.pfp_url || "",
            p_did: custodyAddress,
            p_user_id: null,
          });

          if (upsertError) {
            console.error("Error storing Farcaster data:", upsertError);
            throw new Error(`Failed to store Farcaster user data: ${upsertError.message}`);
          }

          // Handle authentication with Supabase
          const authEmail = `farcaster-${user.fid}@example.com`;
          const authPassword = `fc-${user.fid}-${custodyAddress.substring(0, 8)}`;

          // Try sign in first
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          });

          // If sign-in fails, attempt to sign up
          if (authError) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: authEmail,
              password: authPassword,
              options: {
                data: {
                  fid: user.fid,
                  username: user.username,
                  display_name: user.display_name,
                  avatar_url: user.pfp_url,
                  farcaster_user: true,
                  did: custodyAddress
                }
              }
            });

            if (signUpError) {
              console.error("Error signing up:", signUpError);
              throw new Error(`Could not create user account: ${signUpError.message}`);
            }
          }

          // Save user data in localStorage for easy access
          localStorage.setItem('fid', String(user.fid));
          localStorage.setItem('username', user.username || '');
          
          toast({
            title: "Connected!",
            description: "Farcaster account connected successfully.",
          });

          // Navigate to home page
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/');
          }
        } catch (err: any) {
          console.error("Farcaster auth processing error:", err);
          toast({
            title: "Authentication Error",
            description: err.message || "Failed to complete authentication process.",
            variant: "destructive",
          });
        }
      };

      handleSuccessfulAuth();
    } else if (error) {
      console.error("Farcaster auth error:", error);
      toast({
        title: "Sign-In Error",
        description: error.message || "An error occurred during sign-in.",
        variant: "destructive",
      });
    }
  }, [isSuccess, data, error, toast, router, onSuccess]);

  const handleSignIn = () => {
    try {
      signIn();
    } catch (err: any) {
      console.error("Farcaster sign-in initiation error:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to initiate sign-in.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
          {isPolling ? "Connecting..." : "Sign In with Farcaster Wallet"}
        </button>
      )}
    </>
  );
};

export default NextFarcasterAuthButton;
