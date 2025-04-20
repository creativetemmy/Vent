import React from 'react';
import { PointsHistoryItem } from '@/hooks/useUserProfile';

interface PointsHistoryCardProps {
  item: PointsHistoryItem;
}

const PointsHistoryCard: React.FC<PointsHistoryCardProps> = ({ item }) => {
  return (
    <div className="w-full bg-vent-card rounded-lg p-3 mb-3">
      <div className="flex justify-between items-start">
        <span className="text-white text-sm" style={{ fontFamily: "Inter" }}>{item.date}: {item.action}</span>
        <span className={`text-sm ${item.points < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {item.points > 0 ? '+' : ''}{item.points} 🌟
        </span>
      </div>
      <p className="text-sm text-twitter mt-1 hover:underline cursor-pointer" style={{ fontFamily: "Inter" }}>
        {item.content}
      </p>
      {item.tx_hash && (
        <a
          href={`https://optimistic.etherscan.io/tx/${item.tx_hash}`}
          className="text-yellow-500 text-xs underline font-bold"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on Etherscan"
        >
          View on Etherscan
        </a>
      )}
    </div>
  );
};

export default PointsHistoryCard;
