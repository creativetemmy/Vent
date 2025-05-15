
'use client';

import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '../src/index.css';
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/hooks/use-toast";
import { NeynarContextProvider, Theme } from '@neynar/react';
import '@neynar/react/dist/style.css';

// Create QueryClient at the component level, not at the module level
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a client inside component to ensure it's only created client-side
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <NeynarContextProvider
          settings={{
            clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || '',
            defaultTheme: Theme.Light,
            eventsCallbacks: {
              onAuthSuccess: () => {
                console.log('✅ Auth success');
                window.location.href = '/'; // Redirect after login
              },
              onSignout: () => {
                console.log('👋 Signed out');
              },
            },
          }}
        >
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </TooltipProvider>
              </AuthProvider>
            </QueryClientProvider>
          </ToastProvider>
        </NeynarContextProvider>
      </body>
    </html>
  );
}
