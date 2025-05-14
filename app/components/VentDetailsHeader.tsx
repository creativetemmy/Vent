
'use client';

import React from "react";
import { ArrowLeft, Share } from "lucide-react";

interface Props {
  onBack: () => void;
}

const VentDetailsHeader: React.FC<Props> = ({ onBack }) => (
  <header className="fixed top-0 left-0 right-0 h-header bg-vent-bg border-b border-gray-800 z-10">
    <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between">
      <button onClick={onBack} className="text-white p-2">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-xl font-bold text-white">Vent Details</h1>
      <button className="text-white p-2">
        <Share className="h-5 w-5" />
      </button>
    </div>
  </header>
);

export default VentDetailsHeader;
