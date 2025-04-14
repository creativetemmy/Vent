
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Chain, Wallet } from 'lucide-react';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#121212] flex flex-col items-center justify-center px-4">
      <div className="animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-twitter to-[#7B61FF] bg-clip-text text-transparent mb-2">
            VentVerse
          </h1>
          <p className="text-white text-lg text-center max-w-[300px]">
            Share Your Truth. Find Your Voice.
          </p>
        </div>
        
        <div className="flex flex-col gap-6 items-center mb-12 w-full max-w-[343px]">
          <div className="bg-vent-card p-4 rounded-lg w-full flex items-center gap-3 animate-pulse">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="text-white text-lg">Earn stars for honest feedback</span>
          </div>
          
          <div className="bg-vent-card p-4 rounded-lg w-full flex items-center gap-3 animate-pulse delay-75">
            <Chain className="h-6 w-6 text-twitter" />
            <span className="text-white text-lg">Onchain evidence for transparency</span>
          </div>
          
          <div className="bg-vent-card p-4 rounded-lg w-full flex items-center gap-3 animate-pulse delay-150">
            <Wallet className="h-6 w-6 text-twitter" />
            <span className="text-white text-lg">Connect with your DID</span>
          </div>
        </div>
        
        <div className="text-white text-lg text-center pulse">
          Building a better Web3, together.
        </div>
      </div>
    </div>
  );
};

export default Splash;
