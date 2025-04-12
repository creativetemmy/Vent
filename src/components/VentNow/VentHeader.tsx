
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VentHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
      <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="text-white p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <h1 className="text-xl font-bold text-white">Vent Now</h1>
        
        <div className="flex items-center gap-1 text-white">
          <span className="text-base">100 Points</span>
        </div>
      </div>
    </header>
  );
};

export default VentHeader;
