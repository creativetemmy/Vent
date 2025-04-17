
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  farcasterUser: any | null;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: true,
  farcasterUser: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [farcasterUser, setFarcasterUser] = useState(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setLoading(false);

        if (session?.user) {
          // Try to fetch associated Farcaster user
          const { data: farcasterData } = await supabase
            .from('farcaster_users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          setFarcasterUser(farcasterData);
        } else {
          setFarcasterUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const { data: farcasterData } = await supabase
          .from('farcaster_users')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        setFarcasterUser(farcasterData);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, farcasterUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
