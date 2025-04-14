
import React from 'react';
import VentHeader from '@/components/VentNow/VentHeader';
import VentForm from '@/components/VentNow/VentForm';

const VentNow: React.FC = () => {
  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <VentHeader />
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-8 px-4">
        <h1 className="text-2xl font-bold text-white text-center mb-6 animate-fade-in">Share Your Web3 Experience</h1>
        <VentForm />
      </main>
    </div>
  );
};

export default VentNow;
