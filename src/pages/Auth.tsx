import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarcasterAuth } from '@/hooks/farcaster-auth';
import FarcasterLoginButton from '@/components/FarcasterLoginButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, status } = useFarcasterAuth();

  // Redirect to homepage if user is already logged in
  React.useEffect(() => {
    if (status === 'connected' && user) {
      navigate('/');
    }
  }, [user, status, navigate]);

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-vent-card border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome to Vent</CardTitle>
          <CardDescription className="text-gray-400">
            Share your Web3 experiences and connect with others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-white">
            <p className="mb-4">Sign in with your Farcaster account to continue</p>
            <FarcasterLoginButton className="w-full bg-gradient-to-r from-twitter to-[#7B61FF]" />
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-400">
          <p className="w-full">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
