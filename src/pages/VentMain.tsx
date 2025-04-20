
import React from "react";

interface Props {
  vent: any;
}

const VentMain: React.FC<Props> = ({ vent }) => (
  <div className="w-full max-w-[343px] bg-[#4A4A4A] rounded-lg p-4 mb-4">
    <div className="flex justify-between items-start mb-2">
      <span className="font-bold text-base text-white">
        {vent.user_id.slice(0, 6)}...{vent.user_id.slice(-4)}
      </span>
      <span className="text-sm text-vent-muted">
        {vent.created_at ? new Date(vent.created_at).toLocaleString() : ""}
      </span>
    </div>
    <p className="text-base mb-3 text-white">{vent.content}</p>
    <div className="flex flex-wrap gap-1 mb-3">
      {(vent.hashtags ?? []).map((tag: string, index: number) => (
        <span key={index} className="text-twitter text-sm cursor-pointer hover:underline">
          {tag}
        </span>
      ))}
      {(vent.mentions ?? []).map((m: string, idx: number) => (
        <span key={idx} className="text-twitter text-sm cursor-pointer hover:underline ml-1">
          {m}
        </span>
      ))}
    </div>
    {vent.evidence && (
      <div className="mb-3">
        <img
          src={vent.evidence}
          alt="Vent evidence"
          className="w-full h-auto max-h-[200px] object-cover rounded"
        />
      </div>
    )}
  </div>
);

export default VentMain;
