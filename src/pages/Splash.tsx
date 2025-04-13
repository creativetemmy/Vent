
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col items-center justify-center text-white p-4">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center mb-4">
          <Star className="h-16 w-16 text-twitter mr-2" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-twitter to-[#7B61FF] text-transparent bg-clip-text">
            Vent
          </h1>
        </div>
        
        <p className="text-xl text-center mb-8 max-w-md">
          Speak your truth, one hashtag at a time.
        </p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-24 h-1 bg-gradient-to-r from-twitter to-[#7B61FF] rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default Splash;
