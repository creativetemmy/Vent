
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/hooks/use-toast";
import Index from "./pages/Index";
import VentNow from "./pages/VentNow";
import VentDetails from "./pages/VentDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";
import Auth from "./pages/Auth";
import { FarcasterSignInWrapper, FarcasterAuthProvider } from "@/hooks/farcaster-auth";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <FarcasterSignInWrapper>
              <FarcasterAuthProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/splash" element={<Splash />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/" element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      } />
                      <Route path="/vent-now" element={
                        <ProtectedRoute>
                          <VentNow />
                        </ProtectedRoute>
                      } />
                      <Route path="/vent/:id" element={
                        <ProtectedRoute>
                          <VentDetails />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </FarcasterAuthProvider>
            </FarcasterSignInWrapper>
          </AuthProvider>
        </QueryClientProvider>
      </ToastProvider>
    </React.StrictMode>
  );
};

export default App;
