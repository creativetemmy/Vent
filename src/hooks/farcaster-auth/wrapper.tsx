
import { ReactNode } from 'react';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { NEYNAR_CLIENT_ID } from '@/integrations/neynar/config';

export const FarcasterSignInWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AuthKitProvider
      config={{
        rpcUrl: 'https://mainnet.optimism.io',
        domain: window.location.host,
        siweUri: window.location.origin,
        relay: 'https://relay.farcaster.xyz',
        // Use the correct property based on current @farcaster/auth-kit version
        apiKey: NEYNAR_CLIENT_ID, // Changed to apiKey which is the correct property
      }}
    >
      {children}
    </AuthKitProvider>
  );
};
