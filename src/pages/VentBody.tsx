
import React from 'react';
import { renderEvidence, renderEtherscan } from '@/utils/ventHelpers';

interface VentBodyProps {
  vent: any;
}

const VentBody: React.FC<VentBodyProps> = ({ vent }) => {
  return (
    <div className="w-full max-w-[343px] bg-[#4A4A4A] rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-base text-white" style={{ fontFamily: "Inter" }}>
          {vent.user_id.slice(0, 6)}...{vent.user_id.slice(-4)}
        </span>
        <span className="text-sm text-vent-muted">
          {vent.created_at ? new Date(vent.created_at).toLocaleString() : ""}
        </span>
      </div>
      <p className="text-base mb-3 text-white" style={{ fontFamily: "Inter" }}>{vent.content}</p>
      {renderEvidence(vent)}
      {renderEtherscan(vent)}
      <div className="flex flex-wrap gap-1 mb-3">
        {(vent.hashtags ?? []).map((tag: string, index: number) => (
          <span key={index} className="text-twitter text-sm cursor-pointer hover:underline" style={{ fontFamily: "Inter" }}>
            {tag}
          </span>
        ))}
        {(vent.mentions ?? []).map((m: string, idx: number) => (
          <span key={idx} className="text-twitter text-sm cursor-pointer hover:underline ml-1" style={{ fontFamily: "Inter" }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
};

export default VentBody;
