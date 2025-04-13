
import React from 'react';

interface PointsHistoryItem {
  id: string;
  date: string;
  action: string;
  points: number;
  content: string;
}

interface PointsHistoryCardProps {
  item: PointsHistoryItem;
}

const PointsHistoryCard: React.FC<PointsHistoryCardProps> = ({ item }) => {
  return (
    <div className="w-full bg-vent-card rounded-lg p-3 mb-3">
      <div className="flex justify-between items-start">
        <span className="text-white text-sm">{item.date}: {item.action}</span>
        <span className={`text-sm ${item.points < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {item.points > 0 ? '+' : ''}{item.points} 🌟
        </span>
      </div>
      <p className="text-sm text-twitter mt-1 hover:underline cursor-pointer">{item.content}</p>
    </div>
  );
};

export default PointsHistoryCard;
