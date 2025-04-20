import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { SignInButton } from '@farcaster/auth-kit';
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

  const handleFarcasterSuccess = async (res: any) => {
    try {
      setLoading(true);

      if (res?.fid) {
        let { data, error } = await supabase
          .from('farcaster_users')
          .upsert({
            fid: res.fid,
            username: res.username,
            avatar_url: res.pfp,
            connected_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Welcome!",
          description: `Logged in as ${res.username}`,
        });
        navigate('/');
      } else {
        throw new Error("Farcaster login failed");
      }
    } catch (error: any) {
      toast({
        title: "Farcaster Login Error",
        description: error.message || String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFarcasterError = (error: any) => {
    toast({
      title: "Farcaster Login Error",
      description: error?.message || String(error),
      variant: "destructive",
    });
    setLoading(false);
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
          <div className="w-full">
            <SignInButton
              onSuccess={handleFarcasterSuccess}
              onError={handleFarcasterError}
              className="w-full"
            >
              <span>Connect with Farcaster</span>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
