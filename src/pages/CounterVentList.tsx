
import React from "react";

interface CounterVentListProps {
  counterVents: any[];
}

const CounterVentList: React.FC<CounterVentListProps> = ({ counterVents }) => (
  <>
    {counterVents.length === 0 && (
      <div className="text-vent-muted py-4">No counter-vents yet.</div>
    )}
    {counterVents.map((cv) => (
      <div key={cv.id} className="w-full max-w-[343px] bg-vent-card rounded-lg p-3 mb-3 ml-4 border-l-2 border-gray-600">
        <div className="flex justify-between items-start mb-1">
          <span className="font-bold text-sm text-white">
            {cv.user_id.slice(0, 6)}...{cv.user_id.slice(-4)}
          </span>
          <span className="text-xs text-vent-muted">
            {cv.created_at ? new Date(cv.created_at).toLocaleString() : ""}
          </span>
        </div>
        <p className="text-sm mb-2 text-white">{cv.content}</p>
        {cv.evidence && (
          <div className="mb-2">
            <img
              src={cv.evidence}
              alt="Counter vent evidence"
              className="h-16 w-16 object-cover rounded"
            />
          </div>
        )}
      </div>
    ))}
  </>
);

export default CounterVentList;
