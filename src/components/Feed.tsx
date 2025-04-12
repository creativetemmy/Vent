
import React from 'react';
import VentCard from './VentCard';
import { ventData } from '../data/vents';

const Feed: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-4 w-full">
      {ventData.map((vent) => (
        <VentCard key={vent.id} vent={vent} />
      ))}
    </div>
  );
};

export default Feed;
