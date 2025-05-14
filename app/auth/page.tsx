
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AuthKitProvider } from "@farcaster/auth-kit";
import { useAuth } from '@/contexts/AuthContext';
import FarcasterUsernameLogin from '@/components/auth/FarcasterUsernameLogin';
import { normalizeInput, fetchFarcasterUser, saveUserToSupabase, storeUserInLocalStorage } from '@/components/auth/FarcasterApiHelper';
import NextFarcasterAuthButton from '@/components/NextFarcasterAuthButton';
import Image from 'next/image';

export default function AuthPage() {
  const { session } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in and redirect if needed
    if (session) {
      router.push('/home');
    }
  }, [session, router]);

  const fetchAndUpsertFarcasterUser = async (input: string) => {
    setLoading(true);
    
    try {
      const normalizedInput = normalizeInput(input);
      const user = await fetchFarcasterUser(normalizedInput);
      await saveUserToSupabase(user);
      await handleLogin(user.fid.toString(), user.username);
      
      toast({
        title: "Success!",
        description: `Welcome, @${user.username}!`,
      });
    } catch (err: any) {
      console.error("Error fetching user:", err);
      toast({
        title: "User Not Found",
        description: err?.message || "No Farcaster account found.",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleFarcasterAuthSuccess = async () => {
    toast({
      title: "Success",
      description: "Farcaster account connected!"
    });
    router.push('/home');
  };

  const handleLogin = async (fid: string, username: string) => {
    // Store the user data in localStorage and redirect
    storeUserInLocalStorage(fid, username);
    
    // Navigate to home page
    router.push('/home');
  };

  return (
    <AuthKitProvider
      config={{
        rpcUrl: 'https://mainnet.optimism.io',
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center bg-vent-bg">
        <div className="w-full max-w-[343px] p-6 bg-vent-card rounded-lg shadow-xl">
          <div className="flex justify-center mb-6">
            {/* You can add your logo here */}
            <h1 className="text-2xl font-bold text-white text-center">Vent App</h1>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 text-center">Sign In with Farcaster</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2 items-center">
              <NextFarcasterAuthButton onSuccess={handleFarcasterAuthSuccess} />
              <span className="text-vent-muted text-xs">Secure &mdash; Sign in with your Farcaster Wallet</span>
            </div>
            
            <div className="flex items-center my-4">
              <span className="flex-grow border-t border-gray-700" />
              <span className="mx-3 text-gray-500 text-xs">or</span>
              <span className="flex-grow border-t border-gray-700" />
            </div>
            
            <FarcasterUsernameLogin 
              onLogin={fetchAndUpsertFarcasterUser}
              loading={loading}
            />
          </div>
          
          <div className="mt-6 text-sm text-center text-vent-muted">
            Only Farcaster-enabled accounts can log in.<br />
            Powered by Neynar API &amp; @farcaster/auth-kit
          </div>
        </div>
      </div>
    </AuthKitProvider>
  );
}
