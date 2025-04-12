
import React from 'react';
import { Wallet } from 'lucide-react';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
      <div className="max-w-lg mx-auto px-4 h-full flex flex-col">
        <div className="flex justify-between items-center h-14">
          <h1 className="text-xl font-bold text-white">Vent</h1>
          <div className="flex items-center gap-1 text-white">
            <Wallet className="h-4 w-4" />
            <span className="text-base">100 Points</span>
          </div>
        </div>
        <div className="pb-2">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
