
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
        neynarClientId: NEYNAR_CLIENT_ID,
      }}
    >
      {children}
    </AuthKitProvider>
  );
};
