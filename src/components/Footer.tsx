
import React from 'react';
import { Home, Plus, User } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-footer bg-vent-bg border-t border-gray-800 z-10">
      <div className="max-w-lg mx-auto h-full flex justify-between items-center px-8">
        <button className="flex flex-col items-center justify-center text-white">
          <Home className="h-6 w-6" />
        </button>
        
        <button className="flex items-center justify-center bg-twitter rounded-full h-12 w-30 px-4">
          <Plus className="h-5 w-5 text-white mr-2" />
          <span className="text-white font-medium">Vent Now</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-white">
          <User className="h-6 w-6" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
