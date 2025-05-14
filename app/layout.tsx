
'use client';

import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import '../src/index.css';
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/hooks/use-toast";

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
      </body>
    </html>
  );
}
