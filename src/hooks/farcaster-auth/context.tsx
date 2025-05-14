
import { createContext } from 'react';
import { FarcasterAuthContextType } from './types';

// Initialize context with default values
export const FarcasterAuthContext = createContext<FarcasterAuthContextType>({
  status: 'disconnected',
  user: null,
  isLoading: false,
  error: null,
  login: () => {},
  logout: async () => {},
});
