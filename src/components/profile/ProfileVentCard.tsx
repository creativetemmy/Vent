
import React from 'react';
import { Vent } from '@/data/vents';

interface ProfileVentCardProps {
  vent: Vent;
}

const ProfileVentCard: React.FC<ProfileVentCardProps> = ({ vent }) => {
  return (
    <div className="w-full bg-vent-card rounded-lg p-3 mb-3">
      <p className="text-base mb-2">{vent.content}</p>
      
      {vent.image && (
        <div className="mb-2">
          <img 
            src={vent.image} 
            alt="Vent evidence" 
            className="h-20 w-20 object-cover rounded"
          />
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 mb-1">
        {vent.hashtags.map((tag, index) => (
          <span key={index} className="text-twitter text-sm cursor-pointer hover:underline">
            {tag}
          </span>
        ))}
        {vent.mentions.map((mention, index) => (
          <span key={index} className="text-twitter text-sm cursor-pointer hover:underline ml-1">
            {mention}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileVentCard;
