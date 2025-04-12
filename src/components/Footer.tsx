
import React from 'react';
import { Home, Plus, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-footer bg-vent-bg border-t border-gray-800 z-10">
      <div className="max-w-lg mx-auto h-full flex justify-between items-center px-4">
        <Link to="/" className="text-white">
          <Home className={`h-6 w-6 ${isHome ? 'text-twitter' : 'text-white'}`} />
        </Link>
        
        <Link 
          to="/vent-now" 
          className="bg-twitter rounded-lg w-[120px] h-12 flex items-center justify-center text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="font-medium">Vent Now</span>
        </Link>
        
        <Link to="/profile" className="text-white">
          <User className={`h-6 w-6 ${isProfile ? 'text-twitter' : 'text-white'}`} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
