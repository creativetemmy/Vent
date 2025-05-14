
import React from 'react';
import { Wallet, Star } from 'lucide-react';

interface PointsInfoProps {
  userId: string;
  userPoints: number;
}

const PointsInfo: React.FC<PointsInfoProps> = ({ userId, userPoints }) => {
  return (
    <>
      <div className="flex items-center gap-2 bg-vent-card rounded-lg p-4">
        <Wallet className="h-5 w-5 text-twitter" />
        <span className="text-base text-white">Account: {userId.slice(0, 8)}...{userId.slice(-4)}</span>
      </div>
      <div className="flex items-center gap-2 bg-vent-card rounded-lg p-4">
        <Star className="h-5 w-5 text-yellow-500" />
        <span className="text-base text-white">Available: {userPoints} stars</span>
      </div>
    </>
  );
};

export default PointsInfo;
