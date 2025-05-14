import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { useFarcasterAuth } from '@/hooks/farcaster-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { session } = useAuth();
  const { user, logout } = useFarcasterAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
      <div className="max-w-lg mx-auto px-4 h-full flex flex-col">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="text-xl font-bold text-white">Vent</Link>
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-white bg-gradient-to-r from-twitter to-[#7B61FF] px-3 py-1 rounded-full">
                <Wallet className="h-4 w-4" />
                <span className="text-base">100 🌟</span>
              </div>
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.username} />
                  ) : (
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 text-white" />
              </Button>
            </div>
          )}
        </div>
        <div className="pb-2">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
