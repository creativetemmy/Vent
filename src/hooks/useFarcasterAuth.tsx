
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthKitProvider, useSignIn } from '@farcaster/auth-kit';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cleanupAuthState } from '@/lib/utils';

// Define our own status type since auth-kit doesn't export it
type AuthStatus = 'connected' | 'connecting' | 'disconnected';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName?: string;
  avatar?: string;
  did?: string;
}

interface FarcasterAuthContextType {
  status: AuthStatus;
  user: FarcasterUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
}

const FarcasterAuthContext = createContext<FarcasterAuthContextType>({
  status: 'disconnected',
  user: null,
  isLoading: false,
  error: null,
  login: () => {},
  logout: async () => {},
});

export const FarcasterSignInWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AuthKitProvider
      config={{
        rpcUrl: 'https://mainnet.optimism.io',
        domain: window.location.host,
        siweUri: window.location.origin,
      }}
    >
      {children}
    </AuthKitProvider>
  );
};

export const FarcasterAuthProvider = ({ children }: { children: ReactNode }) => {
  const { signIn, signOut, isConnected, isSuccess, isError, error, data } = useSignIn();
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AuthStatus>('disconnected');

  useEffect(() => {
    // Check if we have a stored user in localStorage
    const storedFid = localStorage.getItem('fid');
    const storedUsername = localStorage.getItem('username');
    
    if (storedFid && storedUsername) {
      setUser({
        fid: parseInt(storedFid, 10),
        username: storedUsername,
      });
    }
  }, []);

  useEffect(() => {
    // Update status based on connection state
    if (isConnected) {
      setStatus('connected');
    } else if (isError) {
      setStatus('disconnected');
    }
  }, [isConnected, isError]);

  useEffect(() => {
    if (isConnected && isSuccess && data) {
      // User has connected their Farcaster account
      const farcasterUser = {
        fid: data.fid,
        username: data.username,
        displayName: data.displayName,
        avatar: data.pfp || null, // Fixing the type issue with pfp 
        did: data.custody?.did || null, // Fixing the type issue with did
      };

      // Save user to state
      setUser(farcasterUser);

      // Save basic info to localStorage for persistence
      localStorage.setItem('fid', farcasterUser.fid.toString());
      localStorage.setItem('username', farcasterUser.username);
      
      // Save user to Supabase
      saveUserToSupabase(farcasterUser);
    } else if (isError || !isConnected) {
      setUser(null);
    }
  }, [isConnected, isSuccess, data, isError]);

  const saveUserToSupabase = async (farcasterUser: FarcasterUser) => {
    setIsLoading(true);
    
    try {
      // Store in Supabase using the upsert_farcaster_user function
      const { data, error } = await supabase.rpc('upsert_farcaster_user', {
        p_fid: farcasterUser.fid,
        p_username: farcasterUser.username,
        p_display_name: farcasterUser.displayName || null,
        p_avatar_url: farcasterUser.avatar || null,
        p_did: farcasterUser.did || null
      });

      if (error) {
        console.error('Error saving Farcaster user:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to store user data',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Authentication Successful',
          description: `Welcome, @${farcasterUser.username}!`,
        });
      }
    } catch (err) {
      console.error('Error in Farcaster auth process:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    if (!isConnected) {
      setStatus('connecting');
      signIn(); // This is the correct way to call signIn() without arguments
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Disconnect from Farcaster
      signOut();
      
      // Clean up localStorage
      localStorage.removeItem('fid');
      localStorage.removeItem('username');
      
      // Clean up auth state
      cleanupAuthState();
      
      // Reset state
      setUser(null);
      setStatus('disconnected');
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
    } catch (err) {
      console.error('Error logging out:', err);
      toast({
        title: 'Logout Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FarcasterAuthContext.Provider
      value={{ 
        status, 
        user, 
        isLoading, 
        error: error?.message || null, 
        login, 
        logout 
      }}
    >
      {children}
    </FarcasterAuthContext.Provider>
  );
};

export const useFarcasterAuth = () => {
  const context = useContext(FarcasterAuthContext);
  if (context === undefined) {
    throw new Error('useFarcasterAuth must be used within a FarcasterAuthProvider');
  }
  return context;
};
