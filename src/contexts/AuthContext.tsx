
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';

interface User {
  id: string;
  email?: string | null;
  farcasterUsername?: string | null;
}

interface AuthSession {
  user: User;
}

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  farcasterUser: any;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: false,
  farcasterUser: null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: farcasterUser, isLoading, logout: farcasterLogout } = useFarcasterAuth();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (farcasterUser) {
        // Create a session based on Farcaster user
        setSession({
          user: {
            id: `farcaster:${farcasterUser.fid}`,
            email: null,
            farcasterUsername: farcasterUser.username,
          }
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    }
  }, [farcasterUser, isLoading]);

  const logout = async () => {
    await farcasterLogout();
  };

  return (
    <AuthContext.Provider value={{
      session,
      loading: loading || isLoading,
      farcasterUser,
      logout
    }}>
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
