
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AtSign } from 'lucide-react';

interface FarcasterUsernameLoginProps {
  onLogin: (input: string) => Promise<void>;
  loading: boolean;
}

const FarcasterUsernameLogin: React.FC<FarcasterUsernameLoginProps> = ({ onLogin, loading }) => {
  const [farcasterInput, setFarcasterInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!farcasterInput.trim()) {
      setErrorMsg("Please enter a Farcaster username or FID");
      return;
    }
    
    setErrorMsg(null);
    try {
      await onLogin(farcasterInput);
    } catch (err: any) {
      setErrorMsg(err?.message || "Unknown error occurred.");
      console.error("Farcaster login error:", err);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && farcasterInput.trim()) handleLogin();
  };

  return (
    <div className="bg-vent-bg/80 rounded-md p-4 border border-gray-800">
      <label className="block text-xs text-vent-muted mb-2">
        Can't use wallet? <span className="font-semibold">Enter your Farcaster username or FID</span> instead:
      </label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <AtSign className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="username or 12345"
            value={farcasterInput}
            onChange={(e) => {
              setFarcasterInput(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full pl-9"
            disabled={loading}
            autoFocus={false}
          />
        </div>
        <Button
          onClick={handleLogin}
          disabled={loading || !farcasterInput.trim()}
          className="w-fit min-w-[100px]"
          variant="secondary"
        >
          {loading ? "Checking..." : "Continue"}
        </Button>
      </div>
      {errorMsg && (
        <div className="text-xs text-red-500 mt-2">{errorMsg}</div>
      )}
    </div>
  );
};

export default FarcasterUsernameLogin;
