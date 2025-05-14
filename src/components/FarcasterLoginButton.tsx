
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';
import { Loader2, LogIn } from 'lucide-react';

interface FarcasterLoginButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const FarcasterLoginButton: React.FC<FarcasterLoginButtonProps> = ({
  variant = 'default',
  size = 'default',
  className,
}) => {
  const { login, isLoading, status } = useFarcasterAuth();

  return (
    <Button
      onClick={login}
      variant={variant}
      size={size}
      className={className}
      disabled={isLoading || status === 'connecting'}
    >
      {isLoading || status === 'connecting' ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Login with Farcaster
        </>
      )}
    </Button>
  );
};

export default FarcasterLoginButton;
