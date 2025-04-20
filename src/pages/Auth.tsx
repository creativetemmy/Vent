
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import FarcasterAuthButton from "@/components/FarcasterAuthButton";

const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster/user";
const NEYNAR_API_KEY = "NEYNAR_DEV_API_KEY"; // Replace with your Neynar API key or use a secret

const Auth = () => {
  const [farcasterInput, setFarcasterInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper: normalize user input (username or FID)
  const normalizeInput = (input: string) => {
    input = input.trim();
    if (/^\d+$/.test(input)) return { type: "fid" as const, value: input };
    if (input.startsWith("@")) input = input.slice(1);
    return { type: "username" as const, value: input };
  };

  // Neynar API user lookup & upsert to Supabase
  const fetchAndUpsertFarcasterUser = async (input: string) => {
    setLoading(true);
    setErrorMsg(null);

    const { type, value } = normalizeInput(input);

    try {
      const param = type === "fid" ? `fid=${value}` : `username=${value}`;
      const res = await fetch(
        `${NEYNAR_API_URL}/lookup?${param}`,
        {
          headers: { "accept": "application/json", "api_key": NEYNAR_API_KEY }
        }
      );
      if (!res.ok) throw new Error("Account not found via Neynar");
      const json = await res.json();
      const user = json.result.user;
      if (!user) throw new Error("No user found, check spelling or FID.");

      // Upsert to Supabase using new function
      const { error } = await supabase.rpc("upsert_farcaster_user", {
        p_fid: user.fid,
        p_username: user.username,
        p_display_name: user.display_name || "",
        p_avatar_url: user.pfp_url || "",
        p_did: user.object.properties?.did || user.custody_address || "",
        p_user_id: null
      });

      if (error) throw new Error(error.message);

      toast({ title: "Success", description: "Farcaster user recognized. You can now continue!" });
      setErrorMsg(null);
    } catch (err: any) {
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

  const handleFarcasterAuthSuccess = () => {
    toast({ 
      title: "Success", 
      description: "Farcaster account connected!" 
    });
    // You can add navigation or further steps here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vent-bg">
      <div className="w-full max-w-md p-6 bg-vent-card rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Login with Farcaster</h1>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter Farcaster username or FID"
            value={farcasterInput}
            onChange={(e) => setFarcasterInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full"
            disabled={loading}
            autoFocus
          />
          <Button
            onClick={handleFarcasterLogin}
            disabled={loading || !farcasterInput}
            className="w-full"
          >
            {loading ? "Checking..." : "Continue"}
          </Button>

          {/* Show error in red if account not found */}
          {errorMsg && (
            <div className="text-sm text-red-500 mt-2">{errorMsg}</div>
          )}

          <div className="border-t border-gray-700 my-4" />

          <div className="flex flex-col gap-2 items-center">
            <span className="text-vent-muted text-sm">or sign in with Farcaster wallet</span>
            <FarcasterAuthButton onSuccess={handleFarcasterAuthSuccess} />
          </div>
        </div>
        <div className="mt-6 text-sm text-center text-vent-muted">
          Only Farcaster-enabled accounts can log in.<br/>
          Powered by Neynar API &amp; @farcaster/auth-kit
        </div>
      </div>
    </div>
  );
};

export default Auth;
