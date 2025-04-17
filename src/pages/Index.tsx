
import React, { useState } from 'react';
import Header from '@/components/Header';
import Tabs from '@/components/Tabs';
import Feed from '@/components/Feed';
import Footer from '@/components/Footer';
import { FarcasterConnect } from '@/components/FarcasterConnect';

const Index = () => {
  const [activeTab, setActiveTab] = useState('top');

  return (
    <div className="min-h-screen bg-vent-bg flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-lg mx-auto w-full pt-[calc(56px+1rem)] pb-footer">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Feed />
      </main>
      
      <Footer />
      <FarcasterConnect />
    </div>
  );
};

export default Index;
