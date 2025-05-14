
import { ReactNode } from 'react';
import { AuthKitProvider } from '@farcaster/auth-kit';

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
