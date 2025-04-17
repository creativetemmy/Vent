
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

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
        </div>
      </div>
    </div>
  );
}

export default Auth;
