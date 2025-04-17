
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { SignInButton, AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      setLoading(true);
      const { error } = type === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      
      if (type === 'login') {
        navigate('/');
      } else {
        toast({
          title: 'Success',
          description: 'Please check your email to confirm your account',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFarcasterSignIn = async (response: any) => {
    try {
      setLoading(true);
      // First verify the signature with Farcaster
      const verifyEndpoint = `https://api.farcaster.xyz/v2/auth/verify`;
      const verifyResponse = await fetch(verifyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: response.message, signature: response.signature }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify Farcaster signature');
      }

      const { fid, username, pfp } = await verifyResponse.json();

      // Now create or update the farcaster user in our database
      const { data: farcasterUser, error: farcasterError } = await supabase
        .from('farcaster_users')
        .upsert({
          fid,
          username,
          avatar_url: pfp,
          connected_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (farcasterError) throw farcasterError;

      // Navigate to home after successful authentication
      navigate('/');

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Define the Farcaster auth configuration
  const farcasterConfig = {
    relay: 'https://relay.farcaster.xyz',
    domain: window.location.host,
    siweUri: window.location.origin,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vent-bg">
      <div className="w-full max-w-md p-6 bg-vent-card rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Welcome to Vent</h1>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-4">
            <Button
              onClick={() => handleAuth('login')}
              disabled={loading}
              className="flex-1"
            >
              Login
            </Button>
            <Button
              onClick={() => handleAuth('signup')}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-vent-card px-2 text-gray-400">Or continue with</span>
            </div>
          </div>
          <AuthKitProvider config={farcasterConfig}>
            <SignInButton
              onSuccess={handleFarcasterSignIn}
              onError={(error) => {
                toast({
                  title: 'Error',
                  description: error.message,
                  variant: 'destructive',
                });
              }}
              text="Connect with Farcaster"
              variant="outline"
            />
          </AuthKitProvider>
        </div>
      </div>
    </div>
  );
}

export default Auth;
