
import React from 'react';
import { Wallet, Calendar } from 'lucide-react';

interface ProfileHeaderProps {
  username: string;
  walletAddress: string;
  points: number;
  resetDate: string;
  ventsCount: number;
  votesCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  walletAddress,
  points,
  resetDate,
  ventsCount,
  votesCount
}) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <h2 className="text-2xl font-bold text-white mb-2">{username}</h2>
      
      <div className="flex items-center gap-1 text-vent-muted mb-4">
        <Wallet className="h-4 w-4" />
        <span className="text-sm">{walletAddress}</span>
      </div>
      
      <div className="bg-gradient-to-r from-twitter to-[#7B61FF] rounded-lg px-6 py-2 mb-1 w-full text-center">
        <span className="text-xl font-bold text-white">{points} 🌟</span>
      </div>
      
      <div className="flex items-center gap-1 text-vent-muted mb-4">
        <Calendar className="h-3 w-3" />
        <span className="text-xs">Reset: {resetDate}</span>
      </div>
      
      <div className="flex gap-6 text-sm text-white">
        <div>Vents: {ventsCount}</div>
        <div>Votes: {votesCount}</div>
      </div>
    </div>
  );
};

export default ProfileHeader;
