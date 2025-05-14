
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email?: string | null;
}

interface AuthSession {
  user: User;
}

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  farcasterUser: null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  session: null, 
  loading: false,
  farcasterUser: null,
  logout: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Mock a session for demo purposes so the app can function without login
  const [session] = useState<AuthSession | null>({
    user: {
      id: 'demo-user-id',
      email: 'demo@example.com'
    }
  });
  
  const [loading] = useState(false);

  const logout = async () => {
    console.log("Logout functionality removed");
    // In a real implementation, this would clear the session
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      loading,
      farcasterUser: null,
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
