
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FarcasterUsernameLoginProps {
  onLogin: (input: string) => Promise<void>;
  loading: boolean;
}

const FarcasterUsernameLogin: React.FC<FarcasterUsernameLoginProps> = ({ onLogin, loading }) => {
  const [farcasterInput, setFarcasterInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!farcasterInput) return;
    setErrorMsg(null);
    try {
      await onLogin(farcasterInput);
    } catch (err: any) {
      setErrorMsg(err?.message || "Unknown error occurred.");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) handleLogin();
  };

  return (
    <div className="bg-vent-bg/80 rounded p-4">
      <label className="block text-xs text-vent-muted mb-2">
        Can't use wallet? <span className="font-semibold">Enter your Farcaster username or FID</span> instead:
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="e.g. alice or 12345"
          value={farcasterInput}
          onChange={(e) => setFarcasterInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          className="w-full"
          disabled={loading}
          autoFocus={false}
        />
        <Button
          onClick={handleLogin}
          disabled={loading || !farcasterInput}
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
