
'use client';

import React from 'react';
import { renderEvidence, renderEtherscan } from '@/utils/ventHelpers';

interface CounterVentItemProps {
  counterVent: any;
}

const CounterVentItem: React.FC<CounterVentItemProps> = ({ counterVent }) => {
  return (
    <div className="w-full max-w-[343px] bg-[#333] rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-base text-white" style={{ fontFamily: "Inter" }}>
          {counterVent.user_id.slice(0, 6)}...{counterVent.user_id.slice(-4)}
        </span>
        <span className="text-sm text-vent-muted">
          {counterVent.created_at ? new Date(counterVent.created_at).toLocaleString() : ""}
        </span>
      </div>
      <p className="text-base mb-3 text-white" style={{ fontFamily: "Inter" }}>{counterVent.content}</p>
      {renderEvidence(counterVent)}
      {renderEtherscan(counterVent)}
    </div>
  );
};

export default CounterVentItem;
