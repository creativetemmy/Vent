
'use client';

import React, { useState } from 'react';
import Header from '@/app/components/Header';
import Tabs from '@/app/components/Tabs';
import Feed from '@/app/components/Feed';
import Footer from '@/app/components/Footer';
import { FarcasterConnect } from '@/components/FarcasterConnect';

export default function HomePage() {
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
}
