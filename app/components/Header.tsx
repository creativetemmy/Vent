
'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, LogOut } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const { session } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
      <div className="max-w-lg mx-auto px-4 h-full flex flex-col">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-xl font-bold text-white">Vent</Link>
          {session && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-white bg-gradient-to-r from-twitter to-[#7B61FF] px-3 py-1 rounded-full">
                <Wallet className="h-4 w-4" />
                <span className="text-base">100 🌟</span>
              </div>
              <Link href="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {session.user.email ? session.user.email.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
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
