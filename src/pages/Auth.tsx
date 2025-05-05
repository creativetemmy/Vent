import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import FarcasterAuthButton from "@/components/FarcasterAuthButton";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { useAuth } from '@/contexts/AuthContext';

const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster/user";
const NEYNAR_API_KEY = "2725A6F7-8E91-419F-80F0-8ED75BDB8223";

const Auth = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in and redirect if needed
    if (session) {
      try {
        navigate('/');
      } catch (error) {
        console.warn('Fallback redirect using window.location');
        window.location.href = '/home';
      }
    }
  }, [session, navigate]);

  const [farcasterInput, setFarcasterInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const normalizeInput = (input: string) => {
    input = input.trim();
    if (/^\d+$/.test(input)) return { type: "fid" as const, value: input };
    if (input.startsWith("@")) input = input.slice(1);
    return { type: "username" as const, value: input };
  };

  const fetchAndUpsertFarcasterUser = async (input: string) => {
    setLoading(true);
    setErrorMsg(null);

    const { type, value } = normalizeInput(input);

    try {
      // First, try to find in Supabase
      if (type === "username") {
        const { data: cachedUser } = await supabase
          .from("farcaster_users")
          .select("*")
          .eq("username", value)
          .maybeSingle();

        if (cachedUser) {
          await handleLogin(cachedUser.fid.toString(), cachedUser.username);
          setLoading(false);
          return;
        }
      }
      
      // If not found in cache, fetch from Neynar
      const param = type === "fid" ? `fid=${value}` : `username=${value}`;
      const endpoint = type === "fid" ? "lookup" : "by_username";
      
      const res = await fetch(
        `${NEYNAR_API_URL}/${endpoint}?${param}`,
        {
          headers: { 
            "accept": "application/json", 
            "api_key": NEYNAR_API_KEY 
          }
        }
      );
      
      if (!res.ok){ 
        throw new Error(`Account not found: ${res.status}`);
      }
      
      const json = await res.json();
      const user = json.user || (json.result?.user);
      
      if (!user) throw new Error("No user found, check spelling or FID.");

      // Use the upsert_farcaster_user RPC function to safely insert or update
      const { error: upsertError } = await supabase.rpc("upsert_farcaster_user", {
        p_fid: user.fid,
        p_username: user.username,
        p_display_name: user.display_name || "",
        p_avatar_url: user.pfp_url || "",
        p_did: user.custody_address || "",
        p_user_id: null
      });

      if (upsertError) {
        console.error("Error upserting user:", upsertError);
        throw new Error(`Failed to save user data: ${upsertError.message}`);
      }

      await handleLogin(user.fid.toString(), user.username);
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setErrorMsg(err?.message || "Unknown error.");
      toast({
        title: "User Not Found",
        description: err?.message || "No Farcaster account found.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFarcasterLogin = async () => {
    if (!farcasterInput) return;
    await fetchAndUpsertFarcasterUser(farcasterInput);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) handleFarcasterLogin();
  };

  const handleFarcasterAuthSuccess = async () => {
    toast({
      title: "Success",
      description: "Farcaster account connected!"
    });
    try {
      navigate('/');
    } catch (error) {
      console.warn('Fallback redirect using window.location');
      window.location.href = '/';
    }
  };

  const handleLogin = async (fid: string, username: string) => {
    // Store the user data in localStorage and redirect
    localStorage.setItem('fid', fid);
    localStorage.setItem('username', username);
    
    // Navigate to home page
    try {
      navigate('/');
    } catch (error) {
      console.warn('Fallback redirect using window.location');
      window.location.href = '/';
    }
  };

  return (
    <AuthKitProvider
      config={{
        rpcUrl: 'https://mainnet.optimism.io',
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-vent-bg">
        <div className="w-full max-w-[343px] p-6 bg-vent-card rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In with Farcaster</h1>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 items-center">
              <FarcasterAuthButton onSuccess={handleFarcasterAuthSuccess} />
              <span className="text-vent-muted text-xs">Secure &mdash; Sign in with your Farcaster Wallet</span>
            </div>
            <div className="flex items-center my-2">
              <span className="flex-grow border-t border-gray-700" />
              <span className="mx-3 text-gray-500 text-xs">or</span>
              <span className="flex-grow border-t border-gray-700" />
            </div>
            <div className="bg-vent-bg/80 rounded p-4">
              <label className="block text-xs text-vent-muted mb-2">
                Can't use wallet? <span className="font-semibold">Enter your Farcaster username or FID</span> instead:
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. alice or 12345"
                  value={farcasterInput}
                  onChange={(e) => setFarcasterInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="w-full"
                  disabled={loading}
                  autoFocus={false}
                />
                <Button
                  onClick={handleFarcasterLogin}
                  disabled={loading || !farcasterInput}
                  className="w-fit min-w-[100px]"
                  variant="secondary"
                >
                  {loading ? "Checking..." : "Continue"}
                </Button>
              </div>
              {errorMsg && (
                <div className="text-xs text-red-500 mt-2">{errorMsg}</div>
              )}
            </div>
          </div>
          <div className="mt-6 text-sm text-center text-vent-muted">
            Only Farcaster-enabled accounts can log in.<br />
            Powered by Neynar API &amp; @farcaster/auth-kit
          </div>
        </div>
      </div>
    </AuthKitProvider>
  );
};

export default Auth;
