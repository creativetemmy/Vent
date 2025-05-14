
import { useContext } from 'react';
import { FarcasterAuthContext } from './context';

export const useFarcasterAuth = () => {
  const context = useContext(FarcasterAuthContext);
  
  if (context === undefined) {
    throw new Error('useFarcasterAuth must be used within a FarcasterAuthProvider');
  }
  
  return context;
};
