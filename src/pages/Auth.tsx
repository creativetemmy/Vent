
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import '@farcaster/auth-kit/styles.css';

const Auth = () => {
  const [farcasterInput, setFarcasterInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper to normalize user input (username or FID)
  const normalizeInput = (input: string) => {
    input = input.trim();
    // If it's all numbers, treat as FID
    if (/^\d+$/.test(input)) return { type: "fid" as const, value: Number(input) };
    // If it's an @username, remove the @
    if (input.startsWith("@")) input = input.slice(1);
    return { type: "username" as const, value: input.toLowerCase() };
  };

  // Authenticate by Farcaster username or FID
  const handleFarcasterLogin = async () => {
    setLoading(true);
    const inputNormalized = normalizeInput(farcasterInput);
    
    try {
      let farcasterUser;
      let error;
      
      if (inputNormalized.type === "fid") {
        // If the input is a FID (number), use eq with the number
        const response = await supabase
          .from("farcaster_users")
          .select("*")
          .eq("fid", inputNormalized.value) // Value is number here
          .maybeSingle();
        
        farcasterUser = response.data;
        error = response.error;
      } else {
        // If the input is a username (string), use ilike with the string
        const response = await supabase
          .from("farcaster_users")
          .select("*")
          .ilike("username", inputNormalized.value as string) // Value is string here
          .maybeSingle();
        
        farcasterUser = response.data;
        error = response.error;
      }

      if (error) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Could not query Farcaster users.",
          variant: "destructive",
        });
        return;
      }
      
      if (!farcasterUser) {
        setLoading(false);
        toast({
          title: "Not Found",
          description: "No Farcaster account found with this username or FID.",
          variant: "destructive",
        });
        return;
      }
      
      if (!farcasterUser.user_id) {
        setLoading(false);
        toast({
          title: "Not Linked",
          description: "This Farcaster account is not yet linked. Please connect your Farcaster account first.",
          variant: "destructive",
        });
        return;
      }

      // At this point, Farcaster account is linked. Try to sign in as that user.
      // We'll use Supabase's "sign in with magic link" for the associated user (user_id)
      // Since we do not have password flow, we need a custom solution.

      // For this demo, we'll instruct the user if not auto-login is possible (Supabase does not allow direct user impersonation from client).
      setLoading(false);
      toast({
        title: "Success",
        description: "Farcaster login found! However, auto-login as a linked user is not possible with Supabase client-only. Please contact support for custom login flow.",
      });
      // Optionally, you could redirect or trigger a backend edge function for custom JWT issuance for the found user_id.
      // For now, just stay on the page.
    } catch (err) {
      setLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      console.error("Login error:", err);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleFarcasterLogin();
    }
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
            {loading ? "Logging in..." : "Continue"}
          </Button>
        </div>
        <div className="mt-6 text-sm text-center text-vent-muted">
          Only Farcaster-enabled accounts can log in.
        </div>
      </div>
    </div>
  );
};

export default Auth;
