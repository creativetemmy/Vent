
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  session: null;
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
  const logout = async () => {
    console.log("Logout functionality removed");
  };

  return (
    <AuthContext.Provider value={{ 
      session: null, 
      loading: false,
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
