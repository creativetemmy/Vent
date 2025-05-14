
import { ReactNode } from 'react';

// Define our own status type since auth-kit doesn't export it
export type AuthStatus = 'connected' | 'connecting' | 'disconnected';

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName?: string;
  avatar?: string;
  did?: string;
}

export interface FarcasterAuthContextType {
  status: AuthStatus;
  user: FarcasterUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
}

export interface ProviderProps {
  children: ReactNode;
}
